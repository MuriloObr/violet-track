package parsers

import (
	"io"

	"github.com/murilo/contas-nubank/backend/internal/models"
)

// Detector orchestrates the detection and parsing of Nubank files.
type Detector struct {
	parsers []Parser
}

func NewDetector() *Detector {
	return &Detector{
		parsers: []Parser{
			&CardReportParser{},
			&StatementReportParser{},
		},
	}
}

// DetectAndParse identifies the correct parser and returns the normalized Bills.
func (d *Detector) DetectAndParse(reader io.Reader, filename string) ([]models.Bill, error) {
	for _, p := range d.parsers {
		if p.CanParse(filename) {
			return p.Parse(reader, filename)
		}
	}
	return nil, ErrUnsupported
}
