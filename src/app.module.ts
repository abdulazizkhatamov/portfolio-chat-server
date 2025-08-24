import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { CoreConfigModule } from 'src/config.module';
import { DatabaseModule } from 'src/database.module';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    CoreConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
