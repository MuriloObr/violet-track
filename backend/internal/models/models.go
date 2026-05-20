package models

import (
	"time"

	"github.com/google/uuid"
)

// Bill represents a financial transaction normalized from various CSV formats.
type Bill struct {
	ID          uuid.UUID `json:"id"`
	Description string    `json:"description"`
	Value       float64   `json:"value"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
}

// Category represents a grouping for bills.
type Category struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// Tag represents a label for granular expense tracking.
type Tag struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// BillTag represents the many-to-many relationship between Bills and Tags.
type BillTag struct {
	BillID uuid.UUID `json:"id_bill"`
	TagID  uuid.UUID `json:"id_tag"`
}
