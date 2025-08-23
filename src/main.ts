import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { parseBoolean } from 'src/utils/parser';
import { csrfSynchronisedProtection } from 'src/common/csrf.config';
import { RedisStore } from 'connect-redis';
import { connectRedis } from 'src/libs/redis-client'; // ⬅️ our singleton

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = Number(config.getOrThrow<string>('SERVER_PORT'));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  // 1) Connect Redis for sessions (not Nest microservices)
  const redis = await connectRedis({
    url: config.getOrThrow<string>('REDIS_URI'),
    username: config.get<string>('REDIS_USERNAME'),
    password: config.get<string>('REDIS_PASSWORD'),
  });

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false, // will persist once something is set (e.g., CSRF secret)
      store: new RedisStore({
        client: redis,
        prefix: config.get<string>('SESSION_FOLDER') ?? 'sess:',
      }),
      cookie: {
        maxAge: Number(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')), // recommend true
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')), // true on HTTPS
        sameSite: config.getOrThrow<string>('SESSION_SAME_SITE') as
          | 'lax'
          | 'strict'
          | 'none',
        // domain: leave undefined in dev (localhost). Set in prod if needed.
      },
    }),
  );

  app.enableCors({
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN').split(', '), // e.g. "http://localhost:3001"
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'Accept',
      'Authorization',
      'x-csrf-token',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(csrfSynchronisedProtection);

  await app.listen(port);
}

bootstrap().catch(console.error);
