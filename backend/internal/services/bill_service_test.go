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
	tagRepo := memory.NewTagRepository()
	billTagRepo := memory.NewBillTagRepository()
	detector := parsers.NewDetector()
	service := NewBillService(repo, tagRepo, billTagRepo, detector)
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

func TestBillService_Update(t *testing.T) {
	repo := memory.NewBillRepository()
	tagRepo := memory.NewTagRepository()
	billTagRepo := memory.NewBillTagRepository()
	detector := parsers.NewDetector()
	service := NewBillService(repo, tagRepo, billTagRepo, detector)
	ctx := context.Background()

	// Setup: Import a bill to update
	csvContent := "date,title,amount\n2023-10-27,Item 1,10.00"
	service.ImportCSV(ctx, strings.NewReader(csvContent), "Nubank_2023-10-27.csv")
	bills, _ := service.GetAll(ctx)
	id := bills[0].ID.String()

	t.Run("Update Successful", func(t *testing.T) {
		newCategory := "Alimentação"
		err := service.Update(ctx, id, newCategory, []string{})
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		updatedBills, _ := service.GetAll(ctx)
		if updatedBills[0].Category != newCategory {
			t.Errorf("Expected category '%s', got '%s'", newCategory, updatedBills[0].Category)
		}
	})

	t.Run("Update Non-existent Bill", func(t *testing.T) {
		err := service.Update(ctx, "00000000-0000-0000-0000-000000000000", "Outros", []string{})
		if err == nil {
			t.Error("Expected error for non-existent bill, got nil")
		}
	})

	t.Run("Update Invalid UUID", func(t *testing.T) {
		err := service.Update(ctx, "invalid-uuid", "Outros", []string{})
		if err == nil {
			t.Error("Expected error for invalid UUID, got nil")
		}
	})
}
