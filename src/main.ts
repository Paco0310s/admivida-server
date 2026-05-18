import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './common/config/envs';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Global Prefix (e.g., http://localhost:3000/api/v1/users)
  app.setGlobalPrefix('api/v1');

  // 2. Enable CORS (Crucial for Flutter mobile emulators and web to connect successfully)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Global Exception Filter (before pipes to catch validation errors)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. Strict Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // 5. Swagger OpenApi Configuration
  const config = new DocumentBuilder()
    .setTitle('Admivida API')
    .setDescription(
      'Backend server for Admivida - Multi-tenant Sales and Inventory Management System',
    )
    .setVersion('1.0')
    .addTag('users', 'Operations related to user management')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI will be hosted at http://localhost:PORT/api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Retains your JWT token upon browser refresh
    },
  });

  // 6. Start server listening
  await app.listen(envs.port);

  logger.log(`Application is running on: http://localhost:${envs.port}/api/v1`);
  logger.log(
    `Swagger documentation available at: http://localhost:${envs.port}/api/docs`,
  );
}

bootstrap();
