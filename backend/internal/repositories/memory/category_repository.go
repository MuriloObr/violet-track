package memory

import (
	"context"
	"sync"

	"github.com/murilo/contas-nubank/backend/internal/models"
)

type CategoryRepository struct {
	mu         sync.RWMutex
	categories []models.Category
}

func NewCategoryRepository() *CategoryRepository {
	return &CategoryRepository{
		categories: []models.Category{},
	}
}

func (r *CategoryRepository) GetAll(ctx context.Context) ([]models.Category, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	result := make([]models.Category, len(r.categories))
	copy(result, r.categories)
	return result, nil
}

func (r *CategoryRepository) Create(ctx context.Context, category models.Category) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	r.categories = append(r.categories, category)
	return nil
}
