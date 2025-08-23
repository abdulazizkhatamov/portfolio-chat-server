import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { CoreConfigModule } from 'src/config.module';
import { DatabaseModule } from 'src/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreConfigModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
