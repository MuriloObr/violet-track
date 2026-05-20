package services

import (
	"context"

	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories"
)

type CategoryService struct {
	repo repositories.CategoryRepository
}

func NewCategoryService(repo repositories.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) GetAll(ctx context.Context) ([]models.Category, error) {
	return s.repo.GetAll(ctx)
}

func (s *CategoryService) Create(ctx context.Context, category models.Category) error {
	return s.repo.Create(ctx, category)
}
