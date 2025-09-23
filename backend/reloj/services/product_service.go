package services

import (
	"motostorm-jokes/backend/reloj/models"
)

func GetProducts() ([]models.Product, error) {
	rows, err := DB.Query("SELECT id, name, price, image FROM products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Image); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}
