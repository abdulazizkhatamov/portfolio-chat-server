// create-conversation.dto.ts
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateConversationDto {
  @IsEnum(['private', 'group'], {
    message: 'Type must be either private or group',
  })
  type: 'private' | 'group';

  @IsMongoId({ each: true })
  @ArrayMinSize(1, { message: 'At least 2 participants are required' })
  @ArrayMaxSize(50, {
    message: 'Maximum 50 participants allowed in a conversation',
  }) // you can adjust
  participants: Types.ObjectId[];

  // required only for group chats
  @IsString()
  @IsNotEmpty()
  name: string;
}
