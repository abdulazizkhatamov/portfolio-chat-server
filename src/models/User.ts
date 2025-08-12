import mongoose, { Schema, Document, Model } from "mongoose";
import argon from "argon2";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastSeen: Date;
  setPassword(password: string): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

UserSchema.methods.setPassword = async function (password: string) {
  this.passwordHash = await argon.hash(password);
};

UserSchema.methods.validatePassword = async function (password: string) {
  return argon.verify(this.passwordHash, password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
