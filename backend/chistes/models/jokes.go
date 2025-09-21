package models

// ChuckNorrisJoke es la estructura que coincide con la respuesta de la API de Chuck Norris
type ChuckNorrisJoke struct {
    IconURL string   `json:"icon_url"`
    ID      string   `json:"id"`
    URL     string   `json:"url"`
    Value   string   `json:"value"`
}

// JokeResponse es la estructura que nuestra API devolverá
type JokeResponse struct {
    Joke string `json:"joke"`
}
