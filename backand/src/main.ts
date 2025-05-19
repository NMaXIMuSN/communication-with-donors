import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './app/exception.filter';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        httpOnly: true, // токен CSRF недоступен JS
        // secure: true, // обязательно для HTTPS
        sameSite: 'strict',
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  // Включите глобальный pipe для валидации и трансформации DTO объектов
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: process.env.CORS,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
