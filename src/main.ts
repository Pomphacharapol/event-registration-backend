import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as express from 'express';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { AppLoggerService } from './common/app-logger';
import { AppConfig } from './common/config/app.config';
import { CorsConfig } from './common/config/cors.config';
import { PaginationMetaDto } from './common/decorators/typeorm-paginate';
import {
  ErrorBadRequestDto,
  ErrorDuplicateUserRequestsDto,
  ErrorForbiddenRequestDto,
  ErrorInternalServerDto,
  ErrorNotFoundDto,
  ErrorTooManyRequestsDto,
  ErrorUnauthorizeRequestDto,
  ErrorUnprocessableRequestDto,
} from './common/dto';
import { BadRequestExceptionFilter } from './common/filters/customException/badRequest.exception';
import { HttpExceptionFilter } from './common/filters/customException/custom.exception';
import { DuplicateExceptionFilter } from './common/filters/customException/duplicate.exception';
import { ForbiddenExceptionFilter } from './common/filters/customException/forbidden.exception';
import { PathNotFoundExceptionFilter } from './common/filters/customException/pathNotFound.exception';
import { UnauthorizedExceptionFilter } from './common/filters/customException/unauthorize.exception';
import { UnknownExceptionFilter } from './common/filters/customException/unknown.exception';
import { LoggingInterceptor } from './common/interceptors/logger/interceptors';
import { TemplateResponseTransformerInterceptor } from './common/interceptors/template-response';
import validation from './common/pipes/validation';
import { GetTodoDto } from './todos/dto';
import { Todo } from './todos/entities/todo.entity';

async function bootstrap() {
  let httpsOptions = null;

  if (process.env.APP_HTTPS_ENABLE === 'true') {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_CERTIFICATE_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE_CERT_PATH),
      passphrase: readFileSync(process.env.SSL_CERTIFICATE_PASSPHRASE_KEY, {
        encoding: 'utf8',
      }),
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
    bufferLogs: true,
  });

  // Load config
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app-config');
  const corsConfig = configService.get<CorsConfig>('cors-config');

  const appLogger = new AppLoggerService(configService);
  app.useLogger(appLogger);

  app.enableCors({
    origin: corsConfig.origin,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
    exposedHeaders: corsConfig.exposedHeaders,
    credentials: true,
  });

  app.disable('x-powered-by');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Add log request and response
  app.useGlobalInterceptors(
    new LoggingInterceptor(new AppLoggerService(configService)),
  );

  // Add response template transformer
  app.useGlobalInterceptors(
    new TemplateResponseTransformerInterceptor(new Reflector()),
  );

  // Filter custom error exception
  app.useGlobalFilters(
    new UnknownExceptionFilter(
      new AppLoggerService(configService),
      appConfig.responseErrorStacktrace,
    ),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(
      new AppLoggerService(configService),
      appConfig.responseErrorMeta,
      appConfig.responseErrorStacktrace,
    ),
  );
  app.useGlobalFilters(
    new PathNotFoundExceptionFilter(appConfig.responseErrorMeta),
  );
  app.useGlobalFilters(
    new BadRequestExceptionFilter(
      new AppLoggerService(configService),
      appConfig.responseErrorMeta,
    ),
  );
  app.useGlobalFilters(
    new DuplicateExceptionFilter(
      new AppLoggerService(configService),
      appConfig.responseErrorMeta,
      appConfig.responseErrorStacktrace,
    ),
  );
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());

  // Transform error validation
  app.useGlobalPipes(validation);

  // Use the compression middleware package to enable gzip compression.
  app.use(
    compression({
      filter: () => true,
    }),
  );

  // Serve static files from the public folder
  app.use('/public', express.static(join(__dirname, '../../', 'public')));

  // Serve static files for custom Swagger UI styling or assets
  app.use('/', express.static(join(__dirname, '..', 'public')));

  app.setGlobalPrefix(appConfig.prefixHttp, { exclude: ['/'] });

  // Swagger
  // About extraModels for resolve bug from nestjs/swagger
  // for more information: https://github.com/nestjs/swagger/issues/669

  const config = new DocumentBuilder()
    .setTitle(appConfig.serviceName)
    .setDescription(appConfig.description)
    .setVersion('1.0')
    .addBearerAuth();
  config.addServer(appConfig.swaggerApiBasePath);

  const document = SwaggerModule.createDocument(app, config.build(), {
    extraModels: [
      ErrorBadRequestDto,
      ErrorDuplicateUserRequestsDto,
      ErrorForbiddenRequestDto,
      ErrorInternalServerDto,
      ErrorNotFoundDto,
      ErrorTooManyRequestsDto,
      ErrorUnauthorizeRequestDto,
      ErrorUnprocessableRequestDto,
      GetTodoDto,
      PaginationMetaDto,
      Todo,
    ],
  });

  SwaggerModule.setup('api-doc', app, document, {
    swaggerUiEnabled: appConfig.apiDocEnabled === true,
    customSiteTitle: '📕 API Documentation',
    customCssUrl: ['/assets/layouts/custom-swagger.css'],
    swaggerOptions: {},
  });

  await app.listen(appConfig.port);

  if (appConfig.apiDocEnabled === true) {
    const url = app.getUrl();

    const localUrl = (await url).replace(
      /https?:\/\/[^/]+/,
      appConfig.httpsEnabled === true
        ? `https://localhost:${appConfig.port}`
        : `http://localhost:${appConfig.port}`,
    );

    console.log(`\n🚀 The Application url is listening at   👉 ${localUrl}`);
    console.log(
      `📕 The API Documentation is listening at 👉 ${localUrl}/api-doc\n`,
    );
  }
}
bootstrap();
