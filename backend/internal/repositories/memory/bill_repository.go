package memory

import (
	"context"
	"sync"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
)

type BillRepository struct {
	mu    sync.RWMutex
	bills []models.Bill
}

func NewBillRepository() *BillRepository {
	return &BillRepository{
		bills: []models.Bill{},
	}
}

func (r *BillRepository) GetAll(ctx context.Context) ([]models.Bill, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	// Return a copy to avoid external mutation
	result := make([]models.Bill, len(r.bills))
	copy(result, r.bills)
	return result, nil
}

func (r *BillRepository) GetByID(ctx context.Context, id string) (models.Bill, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return models.Bill{}, err
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, b := range r.bills {
		if b.ID == uid {
			return b, nil
		}
	}

	return models.Bill{}, models.ErrBillNotFound
}

func (r *BillRepository) CreateMany(ctx context.Context, bills []models.Bill) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	r.bills = append(r.bills, bills...)
	return nil
}

func (r *BillRepository) Update(ctx context.Context, bill models.Bill) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, b := range r.bills {
		if b.ID == bill.ID {
			r.bills[i] = bill
			return nil
		}
	}

	return models.ErrBillNotFound
}
