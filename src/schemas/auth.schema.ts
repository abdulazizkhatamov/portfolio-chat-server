import { JSONSchemaType } from "ajv";

// GET Auth Schema
export const authResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      user: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          first_name: { type: "string" },
          last_name: { type: "string" },
        },
      },
    },
  },
  401: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

// GET Auth CSRF Schema
export const csrfResponseSchema = {
  201: {
    type: "object",
    properties: {
      message: { type: "string" },
      token: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

// POST Register Schema
export interface RegisterBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const registerBodySchema: JSONSchemaType<RegisterBody> = {
  type: "object",
  required: ["first_name", "last_name", "email", "password"],
  properties: {
    first_name: { type: "string", minLength: 1 },
    last_name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
};

export const registerResponseSchema = {
  201: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  400: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

// POST Login Schema
export interface LoginBody {
  email: string;
  password: string;
}

export const loginBodySchema: JSONSchemaType<LoginBody> = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
};

export const loginResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  400: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

// POST Logout Schema
export const logoutResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};
