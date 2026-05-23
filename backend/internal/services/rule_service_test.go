package services

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/repositories/memory"
)

func TestRuleService_Matches(t *testing.T) {
	repo := memory.NewRuleRepository()
	service := NewRuleService(repo)

	t.Run("Description Contains Match", func(t *testing.T) {
		bill := &models.Bill{Description: "Uber Trip 123"}
		rule := models.Rule{Field: "description", Operator: "contains", Value: "Uber"}
		if !service.Matches(bill, rule) {
			t.Error("Expected match for 'Uber' in 'Uber Trip 123'")
		}
	})

	t.Run("Description Contains Case Insensitive", func(t *testing.T) {
		bill := &models.Bill{Description: "uber Trip 123"}
		rule := models.Rule{Field: "description", Operator: "contains", Value: "UBER"}
		if !service.Matches(bill, rule) {
			t.Error("Expected case insensitive match")
		}
	})

	t.Run("Value Greater Than Match", func(t *testing.T) {
		bill := &models.Bill{Value: 250.0}
		rule := models.Rule{Field: "value", Operator: "gt", Value: "200"}
		if !service.Matches(bill, rule) {
			t.Error("Expected 250.0 > 200")
		}
	})

	t.Run("Value Less Than No Match", func(t *testing.T) {
		bill := &models.Bill{Value: 250.0}
		rule := models.Rule{Field: "value", Operator: "lt", Value: "200"}
		if service.Matches(bill, rule) {
			t.Error("Did not expect 250.0 < 200")
		}
	})
}

func TestRuleService_ApplyRules(t *testing.T) {
	repo := memory.NewRuleRepository()
	service := NewRuleService(repo)
	ctx := context.Background()

	tagID := uuid.New()

	service.Create(ctx, models.Rule{
		Name:           "Uber Rule",
		Field:          "description",
		Operator:       "contains",
		Value:          "Uber",
		TargetCategory: "Transporte",
		TargetTagIDs:   []uuid.UUID{tagID},
	})

	t.Run("Apply Rule Successfully", func(t *testing.T) {
		bill := &models.Bill{Description: "Uber Trip"}
		modified, err := service.ApplyRules(ctx, bill)
		if err != nil {
			t.Fatalf("Got error %v", err)
		}
		if !modified {
			t.Error("Expected bill to be modified")
		}
		if bill.Category != "Transporte" {
			t.Errorf("Expected category 'Transporte', got %s", bill.Category)
		}
		if len(bill.Tags) != 1 || bill.Tags[0].ID != tagID {
			t.Error("Expected tag to be applied")
		}
	})
}
