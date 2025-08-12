// src/routes/ws.ts
import { FastifyPluginAsync } from "fastify";
import { WebSocket } from "ws";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { redisClient } from "../libs/redis-client";

type SessionUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

// In-memory sockets for this instance: userId -> Set<WebSocket>
const activeSockets = new Map<string, Set<WebSocket>>();

const wsRoutes: FastifyPluginAsync = async (fastify) => {
  // Create a duplicated Redis client to subscribe
  const sub = redisClient.duplicate();
  await sub.connect();

  // pattern subscribe to all chat channels
  // NOTE: node-redis v4 supports pSubscribe
  await sub.pSubscribe("chat:*", async (message, channel) => {
    try {
      const payload = JSON.parse(message);
      // channel format: chat:<chatId>
      const parts = channel.split(":");
      const chatId = parts.slice(1).join(":");
      // fetch conversation members (could cache in Redis later)
      const conv = await Conversation.findById(chatId).select("members").lean();
      if (!conv) return;
      for (const memberId of conv.members) {
        const set = activeSockets.get(memberId.toString());
        if (!set) continue;
        for (const ws of set) {
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(payload));
          }
        }
      }
    } catch (err) {
      fastify.log.error(err);
    }
  });

  // websocket endpoint
  fastify.get("/ws", { websocket: true }, (socket, req) => {
    // session user (populated by @fastify/session)
    const user = (req.session as any).user as SessionUser | undefined;
    if (!user) {
      // not authenticated
      socket.close();
      return;
    }

    // save socket
    let set = activeSockets.get(user.id);
    if (!set) {
      set = new Set();
      activeSockets.set(user.id, set);
    }
    set.add(socket);

    fastify.log.info(`WS user connected: ${user.id} (sockets: ${set.size})`);

    socket.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === "message") {
          // data: { type: 'message', conversationId, content }
          const conversationId = data.conversationId as string;
          const content = String(data.content || "").trim();
          if (!content) return;

          // save message
          const msg = await Message.create({
            conversationId,
            senderId: user.id,
            content,
            createdAt: new Date(),
          });

          // update conversation lastMessageAt
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessageAt: msg.createdAt,
          }).exec();

          // publish to redis for distribution
          await redisClient.publish(
            `chat:${conversationId}`,
            JSON.stringify({ type: "message", message: msg })
          );
        }

        if (data.type === "typing") {
          // publish typing event to members
          const conversationId = data.conversationId as string;
          await redisClient.publish(
            `chat:${conversationId}`,
            JSON.stringify({ type: "typing", userId: user.id })
          );
        }
      } catch (err) {
        fastify.log.error(err);
      }
    });

    socket.on("close", () => {
      const s = activeSockets.get(user.id);
      if (s) {
        s.delete(socket);
        if (s.size === 0) activeSockets.delete(user.id);
      }
      fastify.log.info(`WS user disconnected: ${user.id}`);
    });
  });
};

export default wsRoutes;
