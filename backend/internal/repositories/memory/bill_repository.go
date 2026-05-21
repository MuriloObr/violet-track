package memory

import (
	"context"
	"sync"

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

func (r *BillRepository) CreateMany(ctx context.Context, bills []models.Bill) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	r.bills = append(r.bills, bills...)
	return nil
}
