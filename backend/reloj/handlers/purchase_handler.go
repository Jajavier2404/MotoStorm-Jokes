package handlers

import (
	"encoding/json"
	"motostorm-jokes/backend/reloj/models"
	"motostorm-jokes/backend/reloj/services"
	"net/http"
)

func CreatePurchaseHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)

	var req models.PurchaseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := services.CreatePurchase(userID, req.Items); err != nil {
		http.Error(w, "Failed to create purchase", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Purchase successful"})
}
