package memory

import (
	"context"
	"sync"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
)

type BillTagRepository struct {
	mu       sync.RWMutex
	billTags []models.BillTag
}

func NewBillTagRepository() *BillTagRepository {
	return &BillTagRepository{
		billTags: []models.BillTag{},
	}
}

func (r *BillTagRepository) GetTagsByBillID(ctx context.Context, billID uuid.UUID) ([]uuid.UUID, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var tagIDs []uuid.UUID
	for _, bt := range r.billTags {
		if bt.BillID == billID {
			tagIDs = append(tagIDs, bt.TagID)
		}
	}
	return tagIDs, nil
}

func (r *BillTagRepository) AddTagToBill(ctx context.Context, billID uuid.UUID, tagID uuid.UUID) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if already exists
	for _, bt := range r.billTags {
		if bt.BillID == billID && bt.TagID == tagID {
			return nil
		}
	}

	r.billTags = append(r.billTags, models.BillTag{
		BillID: billID,
		TagID:  tagID,
	})
	return nil
}

func (r *BillTagRepository) RemoveAllTagsFromBill(ctx context.Context, billID uuid.UUID) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	var newBillTags []models.BillTag
	for _, bt := range r.billTags {
		if bt.BillID != billID {
			newBillTags = append(newBillTags, bt)
		}
	}
	r.billTags = newBillTags
	return nil
}
