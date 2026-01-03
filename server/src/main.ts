import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {toNodeHandler} from "better-auth/node";
import {AuthService} from "@thallesp/nestjs-better-auth";
import {TransformInterceptor} from "./common/transform.interceptor";
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const expressApp = app.getHttpAdapter().getInstance();

  // For base64 image uploads
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
  // END For base64 image uploads

  // Better Auth Route handling
  const authService = app.get<AuthService>(AuthService);
  expressApp.all(
      /^\/api\/auth\/.*/,
      toNodeHandler(authService.instance.handler),
  );
  expressApp.use(require('express').json());
  // END Better Auth Route handling

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
