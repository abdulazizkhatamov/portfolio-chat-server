import fp from "fastify-plugin";
import mongoose from "mongoose";

/**
 * A Fastify plugin to add cookies support
 *
 * @see https://github.com/fastify/fastify-env
 */

export default fp(async (fastify) => {
  await mongoose.connect(fastify.config.DATABASE_URL);
  fastify.log.info("MongoDB connected");
});
