package handlers

import (
	"encoding/json"
	"motostorm-jokes/backend/reloj/services"
	"net/http"
)

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	products, err := services.GetProducts()
	if err != nil {
		http.Error(w, "Failed to get products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
