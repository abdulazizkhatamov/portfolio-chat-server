import { FastifyPluginAsync } from "fastify";
import { User } from "../../models/User";

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/search", async (request, reply) => {
    const { query } = request.query as { query?: string };

    if (!query || query.trim() === "") {
      return reply.status(400).send({ error: "Query parameter is required" });
    }

    try {
      // Case-insensitive regex match
      const regex = new RegExp(query, "i");

      const users = await User.find({
        $or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
      })
        .limit(10) // Prevent large payloads
        .select("first_name last_name email"); // Don't send passwordHash

      return { users };
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
};

export default usersRoute;
