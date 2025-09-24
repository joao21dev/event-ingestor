#!/bin/bash

echo "Waiting kafka gets ready..."
cub kafka broker ready --bootstrap-server broker:29092 --timeout 120 || exit 1

echo "Creating topic 'events'..."
kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic events --partitions 10 --replication-factor 1

echo "Topic 'events' created."
