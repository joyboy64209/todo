import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://todo-frontend-app.vercel.app',
    ],
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(new ValidationPipe());

  app.getHttpAdapter().getInstance().get('*', (req: any, res: any) => {
    if (!req.url.startsWith('/api')) {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();