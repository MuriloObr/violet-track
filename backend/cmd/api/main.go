package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/murilo/contas-nubank/backend/internal/handlers"
	"github.com/murilo/contas-nubank/backend/internal/parsers"
	"github.com/murilo/contas-nubank/backend/internal/repositories/memory"
	"github.com/murilo/contas-nubank/backend/internal/routes"
	"github.com/murilo/contas-nubank/backend/internal/services"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "Contas Nubank API v1.0",
	})

	// Middlewares
	app.Use(logger.New())
	app.Use(recover.New())

	// Initialize Repositories
	billRepo := memory.NewBillRepository()
	categoryRepo := memory.NewCategoryRepository()
	tagRepo := memory.NewTagRepository()

	// Initialize Utilities
	detector := parsers.NewDetector()

	// Initialize Services
	billService := services.NewBillService(billRepo, detector)
	categoryService := services.NewCategoryService(categoryRepo)
	tagService := services.NewTagService(tagRepo)

	// Initialize Handlers
	billHandler := handlers.NewBillHandler(billService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	tagHandler := handlers.NewTagHandler(tagService)

	// Register Routes
	router := routes.NewRouter(billHandler, categoryHandler, tagHandler)
	router.Register(app)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
		})
	})

	// Static files for frontend
	app.Static("/", "./web/dist")

	// SPA Fallback
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./web/dist/index.html")
	})

	log.Fatal(app.Listen(":3000"))
}
