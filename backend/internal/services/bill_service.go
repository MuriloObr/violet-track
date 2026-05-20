package services

import (
	"context"
	"io"

	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/parsers"
	"github.com/murilo/contas-nubank/backend/internal/repositories"
)

type BillService struct {
	repo     repositories.BillRepository
	detector *parsers.Detector
}

func NewBillService(repo repositories.BillRepository, detector *parsers.Detector) *BillService {
	return &BillService{
		repo:     repo,
		detector: detector,
	}
}

func (s *BillService) GetAll(ctx context.Context) ([]models.Bill, error) {
	return s.repo.GetAll(ctx)
}

func (s *BillService) ImportCSV(ctx context.Context, reader io.Reader, filename string) error {
	bills, err := s.detector.DetectAndParse(reader, filename)
	if err != nil {
		return err
	}

	return s.repo.CreateMany(ctx, bills)
}
