package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type Fuckup struct {
	Id    string `json:"id"`
	User  string `json:"user"`
	Desc  string `json:"desc"`
	Likes int64  `json:"likes"`
}

func get(ctx context.Context, db *sql.DB) ([]*Fuckup, error) {
	rows, err := db.QueryContext(ctx, "SELECT id, user, desc, likes FROM fuckups ORDER BY likes DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	fs := make([]*Fuckup, 0)

	for rows.Next() {
		f := Fuckup{}
		err := rows.Scan(&f.Id, &f.User, &f.Desc, &f.Likes)

		if err != nil {
			return fs, err
		}

		fs = append(fs, &f)

	}

	return fs, nil
}

func add(ctx context.Context, db *sql.DB, user, desc string) error {
	stmt, err := db.PrepareContext(ctx, "INSERT INTO fuckups(user, desc) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(user, desc)
	return err
}

func like(ctx context.Context, db *sql.DB, id string) error {
	_, err := db.ExecContext(ctx, "UPDATE fuckups SET likes = likes + 1 WHERE id = ?", id)
	return err
}

func main() {

	log.Println("starting app")

	log.Println("openning db")
	db, err := sql.Open("sqlite3", "fuckups.db")
	if err != nil {
		log.Fatalln("error on openning db:", err)
	}
	defer db.Close()

	r := gin.Default()

	r.GET("/list", func(c *gin.Context) {

		fs, err := get(c, db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"msg": fmt.Sprintf("failed when getting: %v", err),
			})
			return
		}

		c.JSON(http.StatusOK, fs)
	})

	r.POST("/add", func(c *gin.Context) {

		rb := struct{
			User string `json:"user"`
			Desc string `json:"desc"`
		}{}

		if err := json.NewDecoder(c.Request.Body).Decode(&rb) ; err != nil{
			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"msg": "failed parse request",
				},
			)
			return
		}

		if err := add(c, db, rb.User, rb.Desc); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"msg": fmt.Sprintf("failed when adding: %v", err),
			})
			return
		}

		c.JSON(
			http.StatusOK,
			gin.H{
				"msg": "ok",
			},
		)
	})


	r.PUT("/like", func(c *gin.Context) {
		if err := like(c, db, c.Query("id")) ; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"msg": fmt.Sprintf("failed when like: %v", err),
			})
			return
		}

		fmt.Println(c.Query("id"))

		c.JSON(
			http.StatusOK,
			gin.H{
				"msg": "ok",
				"id": c.Query("id"),
			},
		)
	})

	log.Println("running server")
	r.Run()

}
