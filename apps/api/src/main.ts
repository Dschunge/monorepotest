/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3200);
}
bootstrap();
 */

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { RequestInfo, RequestInit } from 'node-fetch';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// import { Transport, MicroserviceOptions } from '@nestjs/microservices';
// import { graphqlUploadExpress } from 'graphql-upload-ts';
import 'dotenv/config';

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

async function bootstrap() {
  //global.fetch = require('node-fetch');

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // app.enableCors({
  //   origin: '*',
  //   methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  //   preflightContinue: true,
  //   optionsSuccessStatus: 204,
  // });

  app.enableCors();

  /* app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  ); */

  // Register the global-header interceptor
  // app.use(GlobalHeaderInterceptor);
  // app.useGlobalInterceptors(GlobalHeaderInterceptor)

  app.useGlobalPipes(new ValidationPipe());

  // interface ExpressSwaggerCustomOptions {
  //   explorer?: boolean;
  //   swaggerOptions?: Record<string, any>;
  //   customCss?: string;
  //   customCssUrl?: string;
  //   customJs?: string;
  //   customfavIcon?: string;
  //   swaggerUrl?: string;
  //   customSiteTitle?: string;
  //   validatorUrl?: string;
  //   url?: string;
  //   urls?: Record<'url' | 'name', string>[];
  // }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Diria HMS REST API')
    .setDescription('API for the Diri Hotel Management System')
    .setVersion('1.1')
    // .addTag('hms', 'adasdasd')
    // .addTag('addasd', 'description')
    //.addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'API-Key')

    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     schema: 'Bearer',
    //     bearerFormat: 'Token',
    //   } as SecuritySchemeObject,
    //   'Bearer'LaunchDarkly
    // )
    .setLicense('License', 'Commercial')
    .setTermsOfService('terms')
    .setContact('Juergen Schaar', '', 'j.schaar@diriahms.net')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  //app.connectMicroservice()

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3200;
  const dburl = process.env.DATABASE_URL;

  //const app = await NestFactory.create(AppModule);
  //await app.listen(3000);

  console.log('dburl: ', dburl);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
  );
  Logger.log(`GraphQL Playground: http://${host}:${port}/graphql`);
}
bootstrap();
