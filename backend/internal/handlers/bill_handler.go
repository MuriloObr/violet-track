package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/murilo/contas-nubank/backend/internal/services"
)

type BillHandler struct {
	service *services.BillService
}

func NewBillHandler(service *services.BillService) *BillHandler {
	return &BillHandler{service: service}
}

func (h *BillHandler) GetAll(c *fiber.Ctx) error {
	bills, err := h.service.GetAll(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(bills)
}

func (h *BillHandler) Import(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File is required",
		})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not open file",
		})
	}
	defer f.Close()

	if err := h.service.ImportCSV(c.Context(), f, file.Filename); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Imported successfully",
	})
}
