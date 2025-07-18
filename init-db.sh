#!/bin/bash

echo "Running database migrations..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "Go is not installed. Using SQLite3 directly..."
    
    # Check if SQLite3 is installed
    if ! command -v sqlite3 &> /dev/null; then
        echo "Error: SQLite3 is not installed. Please install it first."
        exit 1
    fi
    
    # Run migrations using SQLite3
    sqlite3 fuckups.db < migrations/20240101000000_create_fuckups_table.sql
    sqlite3 fuckups.db < migrations/20240101000001_add_likes_index.sql
    
    echo "Database migrations completed using SQLite3!"
else
    # Use Goose migrations
    ./migrate.sh
fi

echo "Database is ready!" 