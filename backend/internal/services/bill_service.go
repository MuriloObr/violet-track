package services

import (
	"context"
	"io"

	"github.com/google/uuid"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/parsers"
	"github.com/murilo/contas-nubank/backend/internal/repositories"
)

type BillService struct {
	repo        repositories.BillRepository
	tagRepo     repositories.TagRepository
	billTagRepo repositories.BillTagRepository
	ruleService *RuleService
	detector    *parsers.Detector
}

func NewBillService(
	repo repositories.BillRepository,
	tagRepo repositories.TagRepository,
	billTagRepo repositories.BillTagRepository,
	ruleService *RuleService,
	detector *parsers.Detector,
) *BillService {
	return &BillService{
		repo:        repo,
		tagRepo:     tagRepo,
		billTagRepo: billTagRepo,
		ruleService: ruleService,
		detector:    detector,
	}
}

func (s *BillService) GetAll(ctx context.Context) ([]models.Bill, error) {
	bills, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	for i := range bills {
		tagIDs, err := s.billTagRepo.GetTagsByBillID(ctx, bills[i].ID)
		if err != nil {
			return nil, err
		}

		var tags []models.Tag
		for _, tagID := range tagIDs {
			tag, err := s.tagRepo.GetByID(ctx, tagID.String())
			if err == nil && tag.ID != uuid.Nil {
				tags = append(tags, tag)
			}
		}
		bills[i].Tags = tags
	}

	return bills, nil
}

func (s *BillService) ImportCSV(ctx context.Context, reader io.Reader, filename string) error {
	bills, err := s.detector.DetectAndParse(reader, filename)
	if err != nil {
		return err
	}

	for i := range bills {
		s.ruleService.ApplyRules(ctx, &bills[i])
	}

	if err := s.repo.CreateMany(ctx, bills); err != nil {
		return err
	}

	// Persist Tags
	for _, bill := range bills {
		for _, tag := range bill.Tags {
			if err := s.billTagRepo.AddTagToBill(ctx, bill.ID, tag.ID); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *BillService) ApplyRulesToAll(ctx context.Context) error {
	bills, err := s.GetAll(ctx)
	if err != nil {
		return err
	}

	for _, bill := range bills {
		modified, err := s.ruleService.ApplyRules(ctx, &bill)
		if err != nil {
			return err
		}
		if modified {
			if err := s.repo.Update(ctx, bill); err != nil {
				return err
			}
			// Update tags
			if err := s.billTagRepo.RemoveAllTagsFromBill(ctx, bill.ID); err != nil {
				return err
			}
			for _, tag := range bill.Tags {
				if err := s.billTagRepo.AddTagToBill(ctx, bill.ID, tag.ID); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func (s *BillService) Update(ctx context.Context, id string, category string, tagIDs []string) error {
	bill, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	bill.Category = category
	if err := s.repo.Update(ctx, bill); err != nil {
		return err
	}

	// Update Tags
	if err := s.billTagRepo.RemoveAllTagsFromBill(ctx, bill.ID); err != nil {
		return err
	}

	for _, tagIDStr := range tagIDs {
		tagID, err := uuid.Parse(tagIDStr)
		if err != nil {
			continue
		}
		if err := s.billTagRepo.AddTagToBill(ctx, bill.ID, tagID); err != nil {
			return err
		}
	}

	return nil
}
