import { JSONSchemaType } from "ajv";

// POST Conversations Schema
export interface PostConversationsBody {
  type: "dm" | "group";
  name: string;
  members: Array<string>;
}

export const postConversationsBodySchema: JSONSchemaType<PostConversationsBody> =
  {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["dm", "group"],
      },
      name: { type: "string", minLength: 1 },
      members: { type: "array", items: { type: "string" } },
    },
    required: ["type", "name", "members"],
  };

export const postConversationsResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
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
  404: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  409: {
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
