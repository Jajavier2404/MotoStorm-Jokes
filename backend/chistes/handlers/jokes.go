package handlers

import (
    "encoding/json"
    "motochistes/services"
    "net/http"
)

// JokeHandler es el manejador para la ruta /joke
func JokeHandler(w http.ResponseWriter, r *http.Request) {
    // Configurar cabeceras para CORS
    w.Header().Set("Access-Control-Allow-Origin", "*") // En producción, sé más restrictivo
    w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

    w.Header().Set("Content-Type", "application/json")

    joke, err := services.GetJoke()
    if err != nil {
        http.Error(w, "Error al obtener el chiste", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(joke)
}
