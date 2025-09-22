package main

import (
    "log"
    "motochistes/handlers"
    "net/http"
)

func main() {
    http.HandleFunc("/joke", handlers.JokeHandler)

    log.Println("Servidor de chistes escuchando en http://localhost:8081")
    if err := http.ListenAndServe(":8081", nil); err != nil {
        log.Fatalf("Error al iniciar el servidor: %s", err)
    }
}
