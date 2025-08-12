import fp from "fastify-plugin";
import websocket from "@fastify/websocket";

/**
 * A Fastify plugin to add cookies support
 *
 * @see https://github.com/fastify/fastify-cookie
 */
export default fp(async (fastify) => {
  await fastify.register(websocket);
});
