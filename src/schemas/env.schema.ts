import { JSONSchemaType } from "ajv";

export interface EnvSchema {
  PORT: number;
  DATABASE_URL: string;
  SESSION_SECRET: string;
  REDIS_URL: string;
  REDIS_USERNAME?: string;
  REDIS_PASSWORD?: string;
  NODE_ENV: "development" | "production" | "test";
}

export const envSchema: JSONSchemaType<EnvSchema> = {
  type: "object",
  required: ["PORT", "DATABASE_URL", "REDIS_URL", "NODE_ENV"],
  properties: {
    PORT: { type: "number", default: 3000 },
    DATABASE_URL: { type: "string" },
    SESSION_SECRET: { type: "string" },
    REDIS_URL: { type: "string" },
    REDIS_USERNAME: { type: "string", nullable: true },
    REDIS_PASSWORD: { type: "string", nullable: true },
    NODE_ENV: { type: "string", enum: ["development", "production", "test"] },
  },
};
