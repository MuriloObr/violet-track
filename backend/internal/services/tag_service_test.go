package services

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories/memory"
)

func TestTagService(t *testing.T) {
	repo := memory.NewTagRepository()
	service := NewTagService(repo)
	ctx := context.Background()

	t.Run("Create and GetAll", func(t *testing.T) {
		tag := models.Tag{ID: uuid.New(), Name: "Essential"}
		err := service.Create(ctx, tag)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		tags, _ := service.GetAll(ctx)
		if len(tags) != 1 {
			t.Errorf("Expected 1 tag, got %d", len(tags))
		}
		if tags[0].Name != "Essential" {
			t.Errorf("Expected name 'Essential', got '%s'", tags[0].Name)
		}
	})
}
