import { IsString, IsObject, IsISO8601, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class EventDto {
    @ApiProperty({
        description: 'The unique identifier for the patient.',
        example: 'patient-12345',
    })
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @ApiProperty({
        description: 'The type of the event.',
        example: 'check-in',
    })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        description: 'A flexible object containing event-specific data.',
        example: { "location": "ward-a", "temperature": 37.5 },
    })
    @IsObject()
    @IsNotEmpty()
    data: object;

    @ApiProperty({
        description: 'The ISO 8601 timestamp of when the event occurred.',
        example: '2025-09-25T10:00:00.000Z',
    })
    @IsISO8601()
    @IsNotEmpty()
    ts: string;
}
