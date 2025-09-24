// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {Logger, ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const kafkaBroker = configService.get<string>('KAFKA_BROKER');

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [kafkaBroker],
            },
            consumer: {
                groupId: 'ingest-group',
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(port);

    Logger.log(`🚀 Ingest service (HTTP API) is running on: http://localhost:${port}` );
    Logger.log(`👂 Ingest service (Kafka Consumer) is listening for messages...`);
}
bootstrap();
