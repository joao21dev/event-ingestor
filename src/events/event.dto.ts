import { IsString, IsObject, IsISO8601, IsNotEmpty } from 'class-validator';

export class EventDto {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsObject()
    @IsNotEmpty()
    data: object;

    @IsISO8601()
    @IsNotEmpty()
    ts: string;
}
