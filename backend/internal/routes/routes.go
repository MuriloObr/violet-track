package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/murilo/contas-nubank/backend/internal/handlers"
)

type Router struct {
	billHandler     *handlers.BillHandler
	categoryHandler *handlers.CategoryHandler
	tagHandler      *handlers.TagHandler
	ruleHandler     *handlers.RuleHandler
}

func NewRouter(
	billHandler *handlers.BillHandler,
	categoryHandler *handlers.CategoryHandler,
	tagHandler *handlers.TagHandler,
	ruleHandler *handlers.RuleHandler,
) *Router {
	return &Router{
		billHandler:     billHandler,
		categoryHandler: categoryHandler,
		tagHandler:      tagHandler,
		ruleHandler:     ruleHandler,
	}
}

func (r *Router) Register(app *fiber.App) {
	api := app.Group("/api")

	// Bills
	api.Get("/bills", r.billHandler.GetAll)
	api.Post("/bills/import", r.billHandler.Import)
	api.Patch("/bills/:id", r.billHandler.Update)

	// Categories
	api.Get("/categories", r.categoryHandler.GetAll)
	api.Post("/categories", r.categoryHandler.Create)

	// Tags
	api.Get("/tags", r.tagHandler.GetAll)
	api.Post("/tags", r.tagHandler.Create)

	// Rules
	api.Get("/rules", r.ruleHandler.GetAll)
	api.Post("/rules", r.ruleHandler.Create)
	api.Put("/rules/:id", r.ruleHandler.Update)
	api.Delete("/rules/:id", r.ruleHandler.Delete)
	api.Post("/rules/apply", r.ruleHandler.Apply)
}
