package parsers

import (
	"io"

	"github.com/murilo/contas-nubank/backend/internal/models"
)

// Parser defines the contract for any CSV report parser.
type Parser interface {
	// Parse takes a reader and a filename, validating and normalizing it into Bills.
	Parse(reader io.Reader, filename string) ([]models.Bill, error)
	// CanParse checks if the filename and/or header matches this parser's format.
	CanParse(filename string) bool
}
