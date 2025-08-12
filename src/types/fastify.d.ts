import "fastify";
import type { EnvSchema } from "../schemas/env.schema";
import { redisClient } from "../libs/redis-client";

declare module "fastify" {
  interface FastifyInstance {
    config: EnvSchema;
    redis: NonNullable<typeof redisClient>;
  }
}
