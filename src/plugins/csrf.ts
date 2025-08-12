import fp from "fastify-plugin";
import csrf, { FastifyCsrfProtectionOptions } from "@fastify/csrf-protection";

/**
 * A fastify csrf plugin
 *
 * @see https://github.com/fastify/csrf-protection
 */
export default fp<FastifyCsrfProtectionOptions>(async (fastify) => {
  await fastify.register(csrf, {
    sessionPlugin: "@fastify/session",
  });
});
