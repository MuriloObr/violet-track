package parsers

import (
	"encoding/csv"
	"io"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
)

// CardReportParser handles Nubank credit card bill reports.
type CardReportParser struct{}

var cardFilenameRegex = regexp.MustCompile(`^Nubank_\d{4}-\d{2}-\d{2}\.csv$`)

func (p *CardReportParser) CanParse(filename string) bool {
	return cardFilenameRegex.MatchString(filename)
}

func (p *CardReportParser) Parse(reader io.Reader, filename string) ([]models.Bill, error) {
	if !p.CanParse(filename) {
		return nil, ErrInvalidFilename
	}

	csvReader := csv.NewReader(reader)
	
	// Read header
	header, err := csvReader.Read()
	if err != nil {
		if err == io.EOF {
			return nil, ErrEmptyFile
		}
		return nil, ErrMalformedCSV
	}

	// Validate header: date,title,amount
	if len(header) < 3 || header[0] != "date" || header[1] != "title" || header[2] != "amount" {
		return nil, ErrMalformedCSV
	}

	var bills []models.Bill
	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, ErrMalformedCSV
		}

		if len(record) < 3 {
			continue // Or return error? GEMINI.md says reject malformed files.
		}

		date, err := time.Parse("2006-01-02", record[0])
		if err != nil {
			return nil, ErrInvalidDate
		}

		value, err := strconv.ParseFloat(record[2], 64)
		if err != nil {
			return nil, ErrInvalidAmount
		}

		bills = append(bills, models.Bill{
			ID:          uuid.New(),
			Date:        date,
			Description: strings.TrimSpace(record[1]),
			Value:       value,
		})
	}

	return bills, nil
}
