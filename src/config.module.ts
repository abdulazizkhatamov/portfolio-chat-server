import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration module available application-wide without needing to re-import it in other modules
      envFilePath: '.env.development', // Specifies the path to the environment variables file used during development
    }),
  ],
  exports: [ConfigModule], // Exports the ConfigModule so that it can be used in other modules if needed
})
export class CoreConfigModule {}
