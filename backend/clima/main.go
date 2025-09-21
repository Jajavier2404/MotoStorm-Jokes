package main

import (
	"fmt"
	"log"
	"net/http"

	"project/handlers"
)

func main() {
	http.HandleFunc("/api/weather", handlers.WeatherHandler)

	fmt.Println("Servidor corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
