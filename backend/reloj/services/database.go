// backend/reloj/services/database.go
package services

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to database!")
	CreateTables()
}

func CreateTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`

	createProductsTable := `
	CREATE TABLE IF NOT EXISTS products (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		price NUMERIC(10, 2) NOT NULL,
		image TEXT
	);`

	createPurchasesTable := `
	CREATE TABLE IF NOT EXISTS purchases (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id),
		purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	createPurchaseItemsTable := `
	CREATE TABLE IF NOT EXISTS purchase_items (
		id SERIAL PRIMARY KEY,
		purchase_id INTEGER REFERENCES purchases(id),
		product_id INTEGER REFERENCES products(id),
		quantity INTEGER NOT NULL,
		total_price NUMERIC(10, 2) NOT NULL
	);`

	tables := []string{createUsersTable, createProductsTable, createPurchasesTable, createPurchaseItemsTable}
	for _, table := range tables {
		_, err := DB.Exec(table)
		if err != nil {
			log.Fatalf("Error creating table: %v", err)
		}
	}

	// Check if products table is empty before inserting
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&count)
	if err != nil {
		log.Fatalf("Failed to query product count: %v", err)
	}

	if count == 0 {
		InsertInitialProducts()
	}
}

func InsertInitialProducts() {
	products := []struct {
		name  string
		price float64
		image string
	}{
		{name: "Box Engasse", price: 15000, image: "boxengasse.png"},
		{name: "English Horse", price: 25000, image: "englishrose.png"},
		{name: "Knock Nap", price: 35000, image: "knocknap.png"},
		{name: "La Night", price: 18000, image: "lanight.png"},
		{name: "Silver All", price: 32000, image: "silverall.png"},
		{name: "Skin Glam", price: 18000, image: "skinglam.png"},
		{name: "Midimix", price: 54000, image: "midimix.png"},
		{name: "Sir Blue", price: 32000, image: "sirblue.png"},
		{name: "Middlesteel", price: 42800, image: "middlesteel.png"},
	}

	for _, p := range products {
		_, err := DB.Exec("INSERT INTO products (name, price, image) VALUES ($1, $2, $3)", p.name, p.price, "/store/img/"+p.image)
		if err != nil {
			log.Fatalf("Failed to insert initial product %s: %v", p.name, err)
		}
	}
	fmt.Println("Initial products inserted successfully.")
}
