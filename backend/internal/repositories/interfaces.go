package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
)

type BillRepository interface {
	GetAll(ctx context.Context) ([]models.Bill, error)
	GetByID(ctx context.Context, id string) (models.Bill, error)
	CreateMany(ctx context.Context, bills []models.Bill) error
	Update(ctx context.Context, bill models.Bill) error
}

type CategoryRepository interface {
	GetAll(ctx context.Context) ([]models.Category, error)
	GetByID(ctx context.Context, id string) (models.Category, error)
	Create(ctx context.Context, category models.Category) error
}

type TagRepository interface {
	GetAll(ctx context.Context) ([]models.Tag, error)
	GetByID(ctx context.Context, id string) (models.Tag, error)
	Create(ctx context.Context, tag models.Tag) error
}

type BillTagRepository interface {
	GetTagsByBillID(ctx context.Context, billID uuid.UUID) ([]uuid.UUID, error)
	AddTagToBill(ctx context.Context, billID uuid.UUID, tagID uuid.UUID) error
	RemoveAllTagsFromBill(ctx context.Context, billID uuid.UUID) error
}
