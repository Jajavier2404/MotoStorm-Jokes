package services

import (
    "encoding/json"
    "motochistes/models"
    "net/http"
)

const chuckAPI = "https://api.chucknorris.io/jokes/random"

// GetJoke obtiene un chiste de la API de Chuck Norris
func GetJoke() (*models.JokeResponse, error) {
    resp, err := http.Get(chuckAPI)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var chuckJoke models.ChuckNorrisJoke
    if err := json.NewDecoder(resp.Body).Decode(&chuckJoke); err != nil {
        return nil, err
    }

    return &models.JokeResponse{Joke: chuckJoke.Value}, nil
}
