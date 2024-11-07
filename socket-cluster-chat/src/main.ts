import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import { ChatsModule } from './chats/chats.module';
import { ChatsService } from './chats/chats.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.select(ChatsModule).get(ChatsService).app = app;

  // Attach SocketCluster server to the HTTP server
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('Socket Cluster Chat')
    .setDescription('A Chat Application with Socket Cluster')
    .setVersion('1.0')
    .addTag('Sockets')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);
}
bootstrap();
