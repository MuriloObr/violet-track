package parsers

import (
	"strings"
	"testing"
)

func TestStatementReportParser_CanParse(t *testing.T) {
	parser := &StatementReportParser{}

	tests := []struct {
		filename string
		expected bool
	}{
		{"NU_1234567_01Oct2023_31Oct2023.csv", true},
		{"Nubank_2023-10-27.csv", false},
		{"invalid.csv", false},
	}

	for _, tt := range tests {
		t.Run(tt.filename, func(t *testing.T) {
			if got := parser.CanParse(tt.filename); got != tt.expected {
				t.Errorf("CanParse() = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestStatementReportParser_Parse(t *testing.T) {
	parser := &StatementReportParser{}

	t.Run("Valid CSV", func(t *testing.T) {
		csvContent := "Data,Valor,Identificador,Descrição\n27/10/2023,100.50,uuid-1,Pix received\n28/10/2023,-50.00,uuid-2,Transfer sent"
		reader := strings.NewReader(csvContent)
		bills, err := parser.Parse(reader, "NU_123_01Oct2023_31Oct2023.csv")

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(bills) != 2 {
			t.Errorf("Expected 2 bills, got %d", len(bills))
		}

		if bills[0].Description != "Pix received" || bills[0].Value != 100.50 {
			t.Errorf("Unexpected bill content: %+v", bills[0])
		}
	})

	t.Run("Invalid Date", func(t *testing.T) {
		csvContent := "Data,Valor,Identificador,Descrição\n2023-10-27,10.00,id,Item"
		reader := strings.NewReader(csvContent)
		_, err := parser.Parse(reader, "NU_123_01Oct2023_31Oct2023.csv")

		if err == nil {
			t.Error("Expected error for invalid date format (should be dd/MM/yyyy), got nil")
		}
	})
}
