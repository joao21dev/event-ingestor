import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {Logger, ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));

    const config = new DocumentBuilder()
        .setTitle('Event Ingestor API')
        .setDescription('API for ingesting and processing events asynchronously.')
        .setVersion('1.0')
        .addTag('events', 'Operations related to event handling')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

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
    Logger.log(`📄 API documentation is available at: http://localhost:${port}/api-docs` );
    Logger.log(`👂 Ingest service (Kafka Consumer) is listening for messages...`);
}
bootstrap();
