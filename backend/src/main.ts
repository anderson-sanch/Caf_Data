import { BadRequestException, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        console.log('validation', errors);

        const messages = errors.flatMap((err) =>
          err.constraints ? Object.values(err.constraints) : [],
        );

        return new BadRequestException(messages[0]);
      },
    }),
  );

  const allowedOrigins = process.env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV === 'production' && !allowedOrigins?.length) {
    throw new Error('CORS_ORIGIN is required in production');
  }

  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
