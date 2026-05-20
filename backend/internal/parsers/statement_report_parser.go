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

// StatementReportParser handles Nubank bank account statement reports.
type StatementReportParser struct{}

var statementFilenameRegex = regexp.MustCompile(`^NU_.*\.csv$`)

func (p *StatementReportParser) CanParse(filename string) bool {
	return statementFilenameRegex.MatchString(filename)
}

func (p *StatementReportParser) Parse(reader io.Reader, filename string) ([]models.Bill, error) {
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

	// Validate header: Data,Valor,Identificador,Descrição
	if len(header) < 4 || header[0] != "Data" || header[1] != "Valor" || header[3] != "Descrição" {
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

		if len(record) < 4 {
			continue
		}

		// Data: dd/MM/yyyy
		date, err := time.Parse("02/01/2006", record[0])
		if err != nil {
			return nil, ErrInvalidDate
		}

		value, err := strconv.ParseFloat(record[1], 64)
		if err != nil {
			return nil, ErrInvalidAmount
		}

		bills = append(bills, models.Bill{
			ID:          uuid.New(),
			Date:        date,
			Description: strings.TrimSpace(record[3]),
			Value:       value,
		})
	}

	return bills, nil
}
