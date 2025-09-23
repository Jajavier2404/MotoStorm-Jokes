package services

import (
	"motostorm-jokes/backend/reloj/models"
)

func CreatePurchase(userID int, items []models.CartItem) error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}

	var purchaseID int
	err = tx.QueryRow("INSERT INTO purchases (user_id) VALUES ($1) RETURNING id", userID).Scan(&purchaseID)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, item := range items {
		var price float64
		err := tx.QueryRow("SELECT price FROM products WHERE id = $1", item.ID).Scan(&price)
		if err != nil {
			tx.Rollback()
			return err
		}

		totalPrice := price * float64(item.Qty)
		_, err = tx.Exec("INSERT INTO purchase_items (purchase_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)", purchaseID, item.ID, item.Qty, totalPrice)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}
