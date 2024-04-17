import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        url: 'localhost:8080',
        protoPath: join(__dirname, '../pb/auth.proto'),
      },
      logger: ['error', 'warn'],
    },
  );

  await app.listen();
}

void bootstrap();
