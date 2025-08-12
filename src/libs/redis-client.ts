// libs/redis-client.ts
import { createClient } from "redis";

let redisClient!: ReturnType<typeof createClient>; // '!' tells TS we'll assign before use

export async function connectRedis({
  url,
  username,
  password,
}: {
  url: string;
  username?: string;
  password?: string;
}) {
  if (!redisClient) {
    redisClient = createClient({
      url,
      username: username || undefined,
      password: password || undefined,
    });

    redisClient.on("error", (err) => console.error("Redis Error", err));
    await redisClient.connect();
    console.log("✅ Redis connected");
  }
  return redisClient;
}

export { redisClient };
