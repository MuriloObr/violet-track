package services

import (
	"context"
	"strings"
	"testing"

	"github.com/murilo/contas-nubank/backend/internal/parsers"
	"github.com/murilo/contas-nubank/backend/internal/repositories/memory"
)

func TestBillService_ImportCSV(t *testing.T) {
	repo := memory.NewBillRepository()
	detector := parsers.NewDetector()
	service := NewBillService(repo, detector)
	ctx := context.Background()

	t.Run("Import Successful Card Report", func(t *testing.T) {
		csvContent := "date,title,amount\n2023-10-27,Item 1,10.00"
		reader := strings.NewReader(csvContent)
		filename := "Nubank_2023-10-27.csv"

		err := service.ImportCSV(ctx, reader, filename)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		bills, _ := repo.GetAll(ctx)
		if len(bills) != 1 {
			t.Errorf("Expected 1 bill in repo, got %d", len(bills))
		}
		if bills[0].Description != "Item 1" {
			t.Errorf("Expected description 'Item 1', got '%s'", bills[0].Description)
		}
	})

	t.Run("Import Unsupported File", func(t *testing.T) {
		reader := strings.NewReader("some content")
		err := service.ImportCSV(ctx, reader, "invalid.txt")

		if err != parsers.ErrUnsupported {
			t.Errorf("Expected ErrUnsupported, got %v", err)
		}
	})

	t.Run("Import Malformed CSV", func(t *testing.T) {
		csvContent := "date,title,amount\n2023-10-27,Item" // Missing amount
		reader := strings.NewReader(csvContent)
		err := service.ImportCSV(ctx, reader, "Nubank_2023-10-27.csv")

		if err == nil {
			t.Error("Expected error for malformed CSV, got nil")
		}
	})
}

func TestBillService_GetAll(t *testing.T) {
	repo := memory.NewBillRepository()
	service := NewBillService(repo, nil)
	ctx := context.Background()

	t.Run("Empty Repo", func(t *testing.T) {
		bills, err := service.GetAll(ctx)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if len(bills) != 0 {
			t.Errorf("Expected 0 bills, got %d", len(bills))
		}
	})
}
