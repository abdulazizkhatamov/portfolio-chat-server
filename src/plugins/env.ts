import fp from "fastify-plugin";
import env, { FastifyEnvOptions } from "@fastify/env";
import { envSchema } from "../schemas/env.schema";

/**
 * A Fastify plugin to add cookies support
 *
 * @see https://github.com/fastify/fastify-env
 */

export default fp<FastifyEnvOptions>(async (fastify) => {
  await fastify.register(env, {
    confKey: "config",
    schema: envSchema,
    dotenv: true,
    data: process.env,
  });
});
