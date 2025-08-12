import fp from "fastify-plugin";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

/**
 * A Fastify plugin to add cookies support
 *
 * @see https://github.com/fastify/fastify-cookie
 */
export default fp<FastifyCookieOptions>(async (fastify) => {
  await fastify.register(cookie);
});