import { Controller, Post, Body, Inject, OnModuleInit, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {EventDto} from "./events/event.dto";

@Controller()
export class AppController implements OnModuleInit {
    private readonly logger = new Logger(AppController.name);

    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) {}

    async onModuleInit() {
        this.logger.log('Connecting to Kafka...');
        await this.kafkaClient.connect();
        this.logger.log('Successfully connected to Kafka.');
    }

    @Post('events')
    @HttpCode(HttpStatus.ACCEPTED)
    async receiveEvent(@Body() event: EventDto) {
        this.logger.log(`Received event for patient: ${event.patientId}`);

        this.kafkaClient.emit(
            'events',
            {
                key: event.patientId,
                value: JSON.stringify(event),
            },
        );

        this.logger.log(`Event for patient ${event.patientId} sent to the 'events' topic.`);

        return { message: 'Event received and queued for processing.' };
    }

    getHello() {
        return undefined;
    }
}
