package main

import (
	"database/sql"
	"flag"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/pressly/goose/v3"
)

func main() {
	var (
		dir     = flag.String("dir", "migrations", "directory with migration files")
		command = flag.String("command", "up", "goose command (up, down, status, etc.)")
		dbPath  = flag.String("db", "fuckups.db", "database file path")
	)
	flag.Parse()

	// Set goose dialect
	goose.SetDialect("sqlite3")

	// Open database
	db, err := sql.Open("sqlite3", *dbPath)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	// Run migration command
	if err := goose.Run(*command, db, *dir); err != nil {
		log.Fatalf("Failed to run migration: %v", err)
	}

	log.Printf("Migration command '%s' completed successfully", *command)
}
