package models

import "time"

type Purchase struct {
    ID          int       `json:"id"`
    UserID      int       `json:"user_id"`
    ProductID   int       `json:"product_id"`
    Quantity    int       `json:"quantity"`
    TotalPrice  float64   `json:"total_price"`
    PurchaseDate time.Time `json:"purchase_date"`
}

type PurchaseRequest struct {
	Items []CartItem `json:"items"`
}

type CartItem struct {
	ID    int `json:"id"`
	Qty int `json:"qty"`
}
