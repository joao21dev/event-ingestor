// src/events.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectModel } from "@nestjs/mongoose";
import { EventDocument, ProcessedEvent } from "../schemas/event.schema";
import { Model } from "mongoose";
import {EventDto} from "./event.dto";

@Controller()
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectModel(ProcessedEvent.name) private eventModel: Model<EventDocument>,
    ) {}

    // --- A VERSÃO CORRETA E SIMPLIFICADA ---
    @MessagePattern('events')
    async processEvent(
        @Payload() message: EventDto, // Recebemos o objeto já analisado (parsed)
        @Ctx() context: KafkaContext,
    ) {
        // ---------------------------------------

        const topic = context.getTopic();
        const partition = context.getPartition();
        const offset = context.getMessage().offset;
        this.logger.log(`Processing event topic ${topic} [partition ${partition} | offset ${offset}]...`);

        // Agora 'message' é o objeto correto, então podemos usá-lo diretamente.
        const eventId = `${message.patientId}-${message.ts}`;

        try {
            this.logger.log(`Starting 5s processing for the patient: ${message.patientId}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            this.logger.log(`5s processing completed.`);

            const newEvent = new this.eventModel({
                ...message,
                eventId: eventId,
                ts: new Date(message.ts),
            });
            await newEvent.save();
            this.logger.log(`Event for patient ${message.patientId} saved to MongoDB successfully.`);

        } catch (error) {
            if (error.code === 11000) {
                this.logger.log(`Duplicate event detected (idempotency). Event for ${message.patientId} has already been processed. Discarding.`);
            } else {
                this.logger.error(`Error saving to MongoDB: ${error.message}`);
                throw error;
            }
        }
    }
}
