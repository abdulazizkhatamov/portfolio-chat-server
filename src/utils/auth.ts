// src/utils/auth.ts
import { FastifyRequest, FastifyReply } from "fastify";

export function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.session?.user) {
    reply.status(401).send({ message: "Unauthorized" });
    return false;
  }
  return true;
}
