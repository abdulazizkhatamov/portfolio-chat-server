import { FastifyPluginAsync } from "fastify";
import {
  authResponseSchema,
  csrfResponseSchema,
  loginBodySchema,
  loginResponseSchema,
  logoutResponseSchema,
  registerBodySchema,
  registerResponseSchema,
} from "../../schemas/auth.schema";
import { User } from "../../models/User";
import { ensureAuthenticated } from "../../utils/auth";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // GET - /auth
  fastify.get(
    "/",
    {
      schema: {
        tags: ["auth"],
        response: authResponseSchema,
      },
    },
    async (request, reply) => {
      try {
        if (!ensureAuthenticated(request, reply)) return;
        return reply
          .status(200)
          .send({ message: "OK", user: request.session.user });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
  // GET /auth/csrf-token
  fastify.get(
    "/csrf-token",
    {
      schema: {
        tags: ["auth"],
        response: csrfResponseSchema,
      },
    },
    async (request, reply) => {
      try {
        const token = reply.generateCsrf();
        return reply.status(201).send({
          message: "CSRF token generated successfully",
          token: token,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
  // POST - /auth/register
  fastify.post(
    "/register",
    {
      preHandler: fastify.csrfProtection,
      schema: {
        tags: ["auth"],
        body: registerBodySchema,
        response: registerResponseSchema,
      },
    },
    async (request, reply) => {
      const { first_name, last_name, email, password } = request.body as {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
      };

      try {
        const dbExistingUser = await User.findOne({ email });

        if (dbExistingUser)
          return reply.status(400).send({ message: "User already exist" });

        const dbNewUser = new User({
          first_name,
          last_name,
          email,
        });

        await dbNewUser.setPassword(password);
        await dbNewUser.save();

        request.session.user = {
          id: dbNewUser.id,
          first_name: dbNewUser.first_name,
          last_name: dbNewUser.last_name,
          email: dbNewUser.email,
        };

        return reply.status(201).send({ message: "User created successfully" });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
  // POST - /auth/login
  fastify.post(
    "/login",
    {
      preHandler: fastify.csrfProtection,
      schema: {
        tags: ["auth"],
        body: loginBodySchema,
        response: loginResponseSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        const dbExistingUser = await User.findOne({ email });

        if (!dbExistingUser)
          return reply.status(400).send({ message: "User not found" });

        const isValid = await dbExistingUser.validatePassword(password);

        if (!isValid)
          return reply
            .status(400)
            .send({ message: "Incorrect email or password" });

        request.session.user = {
          id: dbExistingUser.id,
          email: dbExistingUser.email,
          first_name: dbExistingUser.first_name,
          last_name: dbExistingUser.last_name,
        };
        return reply.status(200).send({ message: "User logged in." });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
  // POST - /auth/logout
  fastify.post(
    "/logout",
    {
      preHandler: fastify.csrfProtection,
      schema: {
        tags: ["auth"],
        response: logoutResponseSchema,
      },
    },
    async (request, reply) => {
      try {
        await request.session.destroy();
        return reply.status(200).send({ message: "Logged out successfully" });
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

export default auth;
