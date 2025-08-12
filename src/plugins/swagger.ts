import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

/**
 * Session plugin for fastify
 *
 * @see https://github.com/fastify/fastify-swagger
 * @see https://github.com/fastify/fastify-swagger-ui
 *
 */

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "My API",
        description: "API documentation",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
  });
});
