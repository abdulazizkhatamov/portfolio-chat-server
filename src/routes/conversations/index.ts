import { FastifyPluginAsync } from "fastify";
import {
  postConversationsBodySchema,
  postConversationsResponseSchema,
} from "../../schemas/conversations.schema";
import { User } from "../../models/User";
import { Conversation } from "../../models/Conversation";

const chat: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // POST - /chats
  fastify.post(
    "/",
    {
      preHandler: fastify.csrfProtection,
      schema: {
        tags: ["conversations"],
        body: postConversationsBodySchema,
        response: postConversationsResponseSchema,
      },
    },
    async (request, reply) => {
      const { type, name, members } = request.body as {
        type: "dm" | "group";
        name: string;
        members: string[]; // emails
      };

      const currentUserId = request.session.user.id;
      const currentUserEmail = request.session.user.email;

      try {
        const providedMembers = Array.isArray(members) ? members : [];

        // ===== Validation: DM must not be with yourself =====
        if (type === "dm") {
          if (providedMembers.length !== 1) {
            return reply
              .status(400)
              .send({
                message: "A private chat must have exactly one recipient.",
              });
          }

          if (
            providedMembers[0].toLowerCase().trim() ===
            currentUserEmail.toLowerCase().trim()
          ) {
            return reply
              .status(400)
              .send({
                message: "You cannot start a private chat with yourself.",
              });
          }
        }

        // ===== Find all users by provided emails =====
        const users = providedMembers.length
          ? await User.find({
              email: {
                $in: providedMembers.map((e) => e.toLowerCase().trim()),
              },
            })
          : [];

        if (users.length !== providedMembers.length) {
          return reply
            .status(404)
            .send({
              message: "One or more specified users could not be found.",
            });
        }

        // Build members list: current user + found users
        const memberIds = [currentUserId, ...users.map((u) => u._id)];

        // ===== Check for existing DM =====
        if (type === "dm") {
          const existingDm = await Conversation.findOne({
            type: "dm",
            members: { $all: memberIds, $size: 2 },
          });

          if (existingDm) {
            return reply.status(409).send({
              message: "A private chat with this user already exists.",
            });
          }
        }

        // ===== Group rules =====
        if (type === "group") {
          if (!name || !name.trim()) {
            return reply
              .status(400)
              .send({ message: "Please provide a name for the group." });
          }
          // Members can be empty when creating a group
        }

        // Create conversation
        const conversation = new Conversation({
          type,
          name: type === "group" ? name.trim() : undefined,
          members: memberIds,
          lastMessageAt: null,
        });

        await conversation.save();

        return reply
          .code(201)
          .send({ message: "Conversation created successfully." });
      } catch (error) {
        fastify.log.error(error);
        return reply
          .status(500)
          .send({
            message: "Something went wrong while creating the conversation.",
          });
      }
    }
  );
};

export default chat;
