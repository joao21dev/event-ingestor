#!/bin/bash

echo "Aguardando o Kafka ficar pronto..."
cub kafka broker ready --bootstrap-server broker:29092 --timeout 120 || exit 1

echo "Criando o tópico 'events'..."
kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic events --partitions 10 --replication-factor 1

echo "Tópico 'events' criado com sucesso."
