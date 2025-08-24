// conversation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true, versionKey: false })
export class Conversation {
  @Prop({ enum: ['private', 'group'], required: true })
  type: 'private' | 'group';

  // for private → always 2 members
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  // group chats
  @Prop({ required: true })
  name: string;

  // last message caching
  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
