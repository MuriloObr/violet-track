package memory

import (
	"context"
	"sync"

	"github.com/murilo/contas-nubank/backend/internal/models"
)

type TagRepository struct {
	mu   sync.RWMutex
	tags []models.Tag
}

func NewTagRepository() *TagRepository {
	return &TagRepository{
		tags: []models.Tag{},
	}
}

func (r *TagRepository) GetAll(ctx context.Context) ([]models.Tag, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	result := make([]models.Tag, len(r.tags))
	copy(result, r.tags)
	return result, nil
}

func (r *TagRepository) Create(ctx context.Context, tag models.Tag) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	r.tags = append(r.tags, tag)
	return nil
}
