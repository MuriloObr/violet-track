package services

import (
	"context"

	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories"
)

type TagService struct {
	repo repositories.TagRepository
}

func NewTagService(repo repositories.TagRepository) *TagService {
	return &TagService{repo: repo}
}

func (s *TagService) GetAll(ctx context.Context) ([]models.Tag, error) {
	return s.repo.GetAll(ctx)
}

func (s *TagService) Create(ctx context.Context, tag models.Tag) error {
	return s.repo.Create(ctx, tag)
}
