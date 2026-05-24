package services

import (
	"context"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories"
)

type RuleService struct {
	ruleRepo repositories.RuleRepository
}

func NewRuleService(ruleRepo repositories.RuleRepository) *RuleService {
	return &RuleService{
		ruleRepo: ruleRepo,
	}
}

func (s *RuleService) GetAll(ctx context.Context) ([]models.Rule, error) {
	return s.ruleRepo.GetAll(ctx)
}

func (s *RuleService) Create(ctx context.Context, rule models.Rule) error {
	if rule.ID == uuid.Nil {
		rule.ID = uuid.New()
	}
	return s.ruleRepo.Create(ctx, rule)
}

func (s *RuleService) Update(ctx context.Context, rule models.Rule) error {
	return s.ruleRepo.Update(ctx, rule)
}

func (s *RuleService) Delete(ctx context.Context, id string) error {
	return s.ruleRepo.Delete(ctx, id)
}

func (s *RuleService) ApplyRules(ctx context.Context, bill *models.Bill) (bool, error) {
	rules, err := s.ruleRepo.GetAll(ctx)
	if err != nil {
		return false, err
	}

	modified := false
	for _, rule := range rules {
		if s.Matches(bill, rule) {
			if rule.TargetCategory != "" {
				bill.Category = rule.TargetCategory
				modified = true
			}
			if len(rule.TargetTagIDs) > 0 {
				for _, tagID := range rule.TargetTagIDs {
					found := false
					for _, existingTag := range bill.Tags {
						if existingTag.ID == tagID {
							found = true
							break
						}
					}
					if !found {
						bill.Tags = append(bill.Tags, models.Tag{ID: tagID})
						modified = true
					}
				}
			}
		}
	}

	return modified, nil
}

func (s *RuleService) Matches(bill *models.Bill, rule models.Rule) bool {
	switch rule.Field {
	case "description":
		return s.matchString(bill.Description, rule.Operator, rule.Value)
	case "value":
		return s.matchFloat(bill.Value, rule.Operator, rule.Value)
	}
	return false
}

func (s *RuleService) matchString(fieldValue, operator, ruleValue string) bool {
	switch operator {
	case "contains":
		return strings.Contains(strings.ToLower(fieldValue), strings.ToLower(ruleValue))
	case "equals":
		return strings.EqualFold(fieldValue, ruleValue)
	}
	return false
}

func (s *RuleService) matchFloat(fieldValue float64, operator, ruleValue string) bool {
	rv, err := strconv.ParseFloat(ruleValue, 64)
	if err != nil {
		return false
	}

	switch operator {
	case "equals":
		return fieldValue == rv
	case "gt":
		return fieldValue > rv
	case "lt":
		return fieldValue < rv
	}
	return false
}
