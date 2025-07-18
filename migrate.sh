#!/bin/bash

# Migration script for fuckups board database

set -e

DB_PATH="${1:-fuckups.db}"
COMMAND="${2:-up}"

echo "Running database migrations..."
echo "Database: $DB_PATH"
echo "Command: $COMMAND"

# Build and run migration tool
go build -o bin/migrate cmd/migrate/main.go
./bin/migrate -db "$DB_PATH" -command "$COMMAND"

echo "Migration completed successfully!" 