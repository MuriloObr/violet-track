package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/murilo/contas-nubank/backend/internal/services"
)

type TagHandler struct {
	service *services.TagService
}

func NewTagHandler(service *services.TagService) *TagHandler {
	return &TagHandler{service: service}
}

func (h *TagHandler) GetAll(c *fiber.Ctx) error {
	tags, err := h.service.GetAll(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(tags)
}
