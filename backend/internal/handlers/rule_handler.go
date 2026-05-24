package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/murilo/contas-nubank/backend/internal/models"
	"github.com/murilo/contas-nubank/backend/internal/services"
)

type RuleHandler struct {
	service     *services.RuleService
	billService *services.BillService
}

func NewRuleHandler(service *services.RuleService, billService *services.BillService) *RuleHandler {
	return &RuleHandler{
		service:     service,
		billService: billService,
	}
}

func (h *RuleHandler) GetAll(c *fiber.Ctx) error {
	rules, err := h.service.GetAll(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(rules)
}

func (h *RuleHandler) Create(c *fiber.Ctx) error {
	var rule models.Rule
	if err := c.BodyParser(&rule); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.service.Create(c.Context(), rule); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(rule)
}

func (h *RuleHandler) Update(c *fiber.Ctx) error {
	var rule models.Rule
	if err := c.BodyParser(&rule); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.service.Update(c.Context(), rule); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(rule)
}

func (h *RuleHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.Delete(c.Context(), id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *RuleHandler) Apply(c *fiber.Ctx) error {
	if err := h.billService.ApplyRulesToAll(c.Context()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"message": "Rules applied to all bills"})
}
