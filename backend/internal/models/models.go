package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrBillNotFound = errors.New("bill not found")
)

// Bill represents a financial transaction normalized from various CSV formats.
type Bill struct {
	ID          uuid.UUID `json:"id"`
	Description string    `json:"description"`
	Value       float64   `json:"value"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
	Tags        []Tag     `json:"tags"`
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

// Rule represents an automation rule for bills.
type Rule struct {
	ID             uuid.UUID   `json:"id"`
	Name           string      `json:"name"`
	Field          string      `json:"field"`          // "description" | "value"
	Operator       string      `json:"operator"`       // "contains" | "equals" | "gt" | "lt"
	Value          string      `json:"value"`          // The value to match against
	TargetCategory string      `json:"target_category"` // Optional: Category name
	TargetTagIDs   []uuid.UUID `json:"target_tag_ids"`  // Optional: Tag IDs
}
