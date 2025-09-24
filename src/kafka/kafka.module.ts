import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [ConfigModule],

                useFactory: (configService: ConfigService) => {
                    const kafkaBroker = configService.get<string>('KAFKA_BROKER');

                    if (!kafkaBroker) {
                        throw new Error("KAFKA_BROKER is not set in the environment variables");
                    }

                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: 'ingest-service-producer',
                                brokers: [kafkaBroker],
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                            },
                        },
                    };
                },

                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class KafkaModule {}
