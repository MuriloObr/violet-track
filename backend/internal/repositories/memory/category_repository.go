package memory

import (
	"context"
	"sync"

	"github.com/google/uuid"
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

func (r *CategoryRepository) GetByID(ctx context.Context, id string) (models.Category, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return models.Category{}, err
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, c := range r.categories {
		if c.ID == uid {
			return c, nil
		}
	}

	return models.Category{}, nil
}

func (r *CategoryRepository) Create(ctx context.Context, category models.Category) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	r.categories = append(r.categories, category)
	return nil
}
