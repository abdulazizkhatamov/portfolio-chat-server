import "@fastify/session";

// 2. Declare module augmentation
declare module "@fastify/session" {
  interface FastifySessionObject {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  }
}
