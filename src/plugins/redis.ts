import fp from "fastify-plugin";
import { connectRedis, redisClient } from "../libs/redis-client";

export default fp(async (fastify) => {
  const client = await connectRedis({
    url: fastify.config.REDIS_URL,
    username: fastify.config.REDIS_USERNAME,
    password: fastify.config.REDIS_PASSWORD,
  });

  // Optionally decorate Fastify instance with the Redis client
  fastify.decorate("redis", client);

  fastify.addHook("onClose", async () => {
    if (redisClient) {
      await redisClient.quit();
      fastify.log.info("Redis connection closed");
    }
  });
});
