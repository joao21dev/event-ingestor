import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = ProcessedEvent & Document;

@Schema({ timestamps: true })
export class ProcessedEvent {
    @Prop({ required: true, index: true })
    patientId: string;

    @Prop({ required: true })
    type: string;

    @Prop({ type: Object })
    data: Record<string, any>;

    @Prop({ required: true })
    ts: Date;

    @Prop({ required: true, unique: true, index: true })
    eventId: string;
}

export const EventSchema = SchemaFactory.createForClass(ProcessedEvent);
