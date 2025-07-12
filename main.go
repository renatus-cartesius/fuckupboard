package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var (
	db *sql.DB
)

type Fuckup struct {
	Id string `json:"id"`
	User string `json:"user"`
	Description string `json:"description"`
	Likes int64 `json:"likes"`
}

func getFuckups(ctx context.Context) ([]*Fuckup, error ) {
	rows, err := db.Query("SELECT * from fuckups")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return nil, nil 
}

func addFuckup(ctx context.Context, f *Fuckup) error {
	return nil
}

func likeFuckup(ctx context.Context, id string) error {
	return nil
}

func main() {

	var err error

	db, err = sql.Open("sqlite3", "fckups.db")
	if err != nil {
		log.Fatalln("error on openning db:", err)
	}
	defer db.Close()


	r := gin.Default()


	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Run()

}
