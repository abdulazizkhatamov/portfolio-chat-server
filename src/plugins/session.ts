import fp from "fastify-plugin";
import session, { FastifySessionOptions } from "@fastify/session";
import { RedisStore } from "connect-redis";
import { redisClient } from "../libs/redis-client";

/**
 * Session plugin for fastify
 *
 * @see https://github.com/fastify/session
 */
export default fp<FastifySessionOptions>(async (fastify) => {
  await fastify.register(session, {
    secret: fastify.config.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: fastify.config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
  });
});
