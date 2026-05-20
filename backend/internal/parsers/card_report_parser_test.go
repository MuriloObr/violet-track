package parsers

import (
	"strings"
	"testing"
)

func TestCardReportParser_CanParse(t *testing.T) {
	parser := &CardReportParser{}

	tests := []struct {
		filename string
		expected bool
	}{
		{"Nubank_2023-10-27.csv", true},
		{"Nubank_2024-01-01.csv", true},
		{"NU_123_01Jan2023_31Jan2023.csv", false},
		{"invalid.csv", false},
		{"Nubank_2023-10-27.txt", false},
	}

	for _, tt := range tests {
		t.Run(tt.filename, func(t *testing.T) {
			if got := parser.CanParse(tt.filename); got != tt.expected {
				t.Errorf("CanParse() = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestCardReportParser_Parse(t *testing.T) {
	parser := &CardReportParser{}

	t.Run("Valid CSV", func(t *testing.T) {
		csvContent := "date,title,amount\n2023-10-27,Supermarket,50.25\n2023-10-28,Gas Station,120.00"
		reader := strings.NewReader(csvContent)
		bills, err := parser.Parse(reader, "Nubank_2023-10-27.csv")

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(bills) != 2 {
			t.Errorf("Expected 2 bills, got %d", len(bills))
		}

		if bills[0].Description != "Supermarket" || bills[0].Value != 50.25 {
			t.Errorf("Unexpected bill content: %+v", bills[0])
		}
	})

	t.Run("Invalid Date", func(t *testing.T) {
		csvContent := "date,title,amount\ninvalid-date,Item,10.00"
		reader := strings.NewReader(csvContent)
		_, err := parser.Parse(reader, "Nubank_2023-10-27.csv")

		if err == nil {
			t.Error("Expected error for invalid date, got nil")
		}
	})

	t.Run("Invalid Amount", func(t *testing.T) {
		csvContent := "date,title,amount\n2023-10-27,Item,invalid-amount"
		reader := strings.NewReader(csvContent)
		_, err := parser.Parse(reader, "Nubank_2023-10-27.csv")

		if err == nil {
			t.Error("Expected error for invalid amount, got nil")
		}
	})

	t.Run("Missing Columns", func(t *testing.T) {
		csvContent := "date,title\n2023-10-27,Item"
		reader := strings.NewReader(csvContent)
		_, err := parser.Parse(reader, "Nubank_2023-10-27.csv")

		if err == nil {
			t.Error("Expected error for missing columns, got nil")
		}
	})
}
