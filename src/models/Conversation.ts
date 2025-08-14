import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IConversation extends Document {
  type: "dm" | "group";
  name?: string; // only for groups
  members: Types.ObjectId[]; // user IDs
  createdAt: Date;
  lastMessageAt?: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ["dm", "group"], required: true },
    name: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessageAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

ConversationSchema.index({ members: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
