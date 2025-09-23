package services

import (
	"motostorm-jokes/backend/reloj/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(email, password string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email: email,
	}

	err = DB.QueryRow("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", email, string(hashedPassword)).Scan(&user.ID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	err := DB.QueryRow("SELECT id, email, password FROM users WHERE email = $1", email).Scan(&user.ID, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
