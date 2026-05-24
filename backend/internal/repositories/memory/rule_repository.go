package memory

import (
	"context"
	"sync"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
)

type RuleRepository struct {
	mu    sync.RWMutex
	rules []models.Rule
}

func NewRuleRepository() *RuleRepository {
	return &RuleRepository{
		rules: []models.Rule{},
	}
}

func (r *RuleRepository) GetAll(ctx context.Context) ([]models.Rule, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]models.Rule, len(r.rules))
	copy(result, r.rules)
	return result, nil
}

func (r *RuleRepository) GetByID(ctx context.Context, id string) (models.Rule, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return models.Rule{}, err
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, rule := range r.rules {
		if rule.ID == uid {
			return rule, nil
		}
	}

	return models.Rule{}, nil
}

func (r *RuleRepository) Create(ctx context.Context, rule models.Rule) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.rules = append(r.rules, rule)
	return nil
}

func (r *RuleRepository) Update(ctx context.Context, rule models.Rule) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, existing := range r.rules {
		if existing.ID == rule.ID {
			r.rules[i] = rule
			return nil
		}
	}

	return nil
}

func (r *RuleRepository) Delete(ctx context.Context, id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for i, rule := range r.rules {
		if rule.ID == uid {
			r.rules = append(r.rules[:i], r.rules[i+1:]...)
			return nil
		}
	}

	return nil
}
