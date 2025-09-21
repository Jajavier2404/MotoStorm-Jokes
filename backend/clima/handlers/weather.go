package handlers

import (
	"encoding/json"
	"net/http"
	"project/services"
)

func WeatherHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	city := r.URL.Query().Get("city")
	if city == "" {
		http.Error(w, `{"error":"city parameter is required"}`, http.StatusBadRequest)
		return
	}

	data, err := services.GetWeather(city)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch weather"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}
