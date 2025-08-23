import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon from 'argon2';

export interface UserMethods {
  setPassword(this: UserDocument, password: string): Promise<void>;
  verifyPassword(this: UserDocument, password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<User> & UserMethods;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Explicitly type `this` as UserDocument
UserSchema.methods.setPassword = async function (
  this: UserDocument,
  password: string,
) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  this.password = await argon.hash(password);
};

UserSchema.methods.verifyPassword = async function (
  this: UserDocument,
  password: string,
) {
  if (!password || typeof password !== 'string' || !this.password) return false;
  return argon.verify(this.password, password);
};

// Pre-save hook with typed `this`
UserSchema.pre<UserDocument>('save', async function (this: UserDocument, next) {
  if (
    this.isModified('password') &&
    typeof this.password === 'string' &&
    this.password &&
    !this.password.startsWith('$argon2')
  ) {
    this.password = await argon.hash(this.password);
  }
  next();
});
