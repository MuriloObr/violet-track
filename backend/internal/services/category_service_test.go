package services

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories/memory"
)

func TestCategoryService(t *testing.T) {
	repo := memory.NewCategoryRepository()
	service := NewCategoryService(repo)
	ctx := context.Background()

	t.Run("Create and GetAll", func(t *testing.T) {
		cat := models.Category{ID: uuid.New(), Name: "Food"}
		err := service.Create(ctx, cat)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		cats, _ := service.GetAll(ctx)
		if len(cats) != 1 {
			t.Errorf("Expected 1 category, got %d", len(cats))
		}
		if cats[0].Name != "Food" {
			t.Errorf("Expected name 'Food', got '%s'", cats[0].Name)
		}
	})
}
