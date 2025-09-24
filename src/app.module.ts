import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import * as Joi from 'joi';
import {EventsController} from "./events/controller";
import {EventSchema, ProcessedEvent} from "./schemas/event.schema";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGO_URI: Joi.string().required(),
                KAFKA_BROKER: Joi.string().required(),
                PORT: Joi.number().default(3000),
            }),
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: ProcessedEvent.name, schema: EventSchema }]),
        KafkaModule,
    ],
    controllers: [AppController, EventsController],
    providers: [AppService],
})
export class AppModule {}
