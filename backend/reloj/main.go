package main

import (
	"fmt"
	"log"
	"net/http"

	"motostorm-jokes/backend/reloj/handlers"
	"motostorm-jokes/backend/reloj/middleware"
	"motostorm-jokes/backend/reloj/services"
)

func main() {
	services.InitDB()

	http.HandleFunc("/api/reloj/register", handlers.RegisterHandler)
	http.HandleFunc("/api/reloj/login", handlers.LoginHandler)
	http.HandleFunc("/api/reloj/products", handlers.GetProductsHandler)
	http.Handle("/api/reloj/purchase", middleware.AuthMiddleware(http.HandlerFunc(handlers.CreatePurchaseHandler)))

	// CORS Middleware
	corsHandler := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Adjust to your frontend's origin
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	fmt.Println("Servidor de Relojes corriendo en http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", corsHandler(http.DefaultServeMux)))
}
