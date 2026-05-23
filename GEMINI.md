# AGENTS.md

## Project Overview

This project is a financial management application specialized for :contentReference[oaicite:0]{index=0} account and credit card reports.

The application allows users to:

- Manage bills and expenses
- Organize expenses using categories and tags
- Import CSV reports exported from Nubank
- Normalize different CSV formats into a unified `Bill` entity
- Visualize and manage financial history

The application architecture uses:

- Backend: :contentReference[oaicite:1]{index=1}
- Frontend: :contentReference[oaicite:2]{index=2}
- Database persistence
- Docker multi-stage builds

The frontend is compiled into static assets and served directly by the backend.

---

# Project Structure

```text
project/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   │
│   ├── internal/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── parsers/
│   │   ├── validators/
│   │   ├── models/
│   │   └── tests/
│   │
│   ├── web/
│   │   └── dist/
│   │
│   ├── quality_gate.go
│   ├── go.mod
│   └── go.sum
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/
│
├── Dockerfile
├── docker-compose.yml
└── AGENTS.md
```

---

# Core Domain

## Entities

### Bill

```text
Bill {
    id,
    description,
    value,
    category,
    date
}
```

### Category

```text
Category {
    id,
    name
}
```

### Tag

```text
Tag {
    id,
    name
}
```

### BillTag

```text
BillTag {
    id_bill,
    id_tag
}
```

---

# CSV Import System

The system must support importing multiple CSV formats exported from Nubank.

Each parser MUST normalize data into the `Bill` entity.

The parser implementation must be isolated, testable, and extensible.

---

# Supported CSV Formats

## CardReport

Credit card bill report.

### File Name Format

```text
Nubank_yyyy-MM-dd.csv
```

### CSV Format

```csv
date,title,amount
yyyy-MM-dd,string,float
```

### Mapping Rules

| CSV Field | Bill Field       |
| --------- | ---------------- |
| date      | Bill.date        |
| title     | Bill.description |
| amount    | Bill.value       |

---

## StatementReport

Bank account statement report.

### File Name Format

```text
NU_number_ddmmmyyyy_ddmmmyyyy.csv
```

### CSV Format

```csv
Data,Valor,Identificador,Descrição
dd/MM/yyyy,float,UUID,string
```

### Mapping Rules

| CSV Field | Bill Field       |
| --------- | ---------------- |
| Data      | Bill.date        |
| Descrição | Bill.description |
| Valor     | Bill.value       |

---

# Parser Architecture Rules

CSV parsing logic MUST:

- Be separated by report type
- Use dedicated parser interfaces
- Validate filename patterns
- Validate CSV structure
- Reject malformed files
- Avoid silent failures
- Return structured errors

Recommended structure:

```text
internal/parsers/
├── interfaces/
├── card_report_parser.go
├── statement_report_parser.go
├── detector.go
└── models.go
```

---

# Architecture Rules

## Backend

The backend must expose:

- REST APIs
- CSV upload endpoints
- Static frontend assets
- SPA fallback routing

Backend routing must remain modular.

Business rules must stay inside `services`.

Database access must stay inside `repositories`.

CSV normalization rules must stay inside `parsers`.

HTTP logic must stay inside `handlers`.

---

# Frontend

Frontend must provide:

- CSV upload interface
- Bill listing
- Category management
- Tag management
- Financial filtering/search

Frontend must be fully independent during development.

Vite dev server should proxy API requests to the backend.

Production builds must generate static files into `frontend/dist`.

---

# Development Rules

## Mandatory Test-First Development

Before implementing any feature:

1. Tests MUST be written first.
2. The implementation MUST satisfy the tests.
3. Existing tests MUST continue passing.

Required principles:

- TDD (Test Driven Development)
- Small isolated tests
- Deterministic behavior
- No flaky tests

---

# Mandatory Parser Tests

Every parser MUST include tests for:

- Valid file names
- Invalid file names
- Valid CSV parsing
- Invalid CSV formats
- Invalid dates
- Invalid numeric values
- Missing columns
- Empty files
- UTF-8 handling
- Malformed rows

---

# Code Quality Rules

All generated code MUST:

- Follow clean architecture principles
- Follow SOLID principles
- Avoid duplicated logic
- Avoid unnecessary abstractions
- Use descriptive naming
- Keep functions small and focused
- Prefer composition over inheritance
- Avoid global mutable state
- Avoid god objects
- Avoid tightly coupled modules

---

# Go Backend Standards

## Required

- Use context-aware operations where appropriate
- Proper error handling everywhere
- No ignored errors
- Structured logging preferred
- Interfaces only when necessary
- Dependency injection preferred

## Forbidden

- Panic-based control flow
- Monolithic handlers
- Business logic inside routes
- Database queries inside handlers
- Circular dependencies

---

# Frontend Standards

Frontend code must:

- Use reusable components
- UI components must be build with shadcn/ui and tailwindcss
- Use PNPM as package manager
- Keep state localized when possible
- Separate UI from API logic
- Avoid large components
- Avoid duplicated state
- Use typed APIs whenever possible

---

# Docker Rules

The project uses multi-stage builds:

1. Frontend build stage
2. Backend build stage
3. Minimal runtime image

The frontend build output must be copied into:

```text
backend/web/dist
```

Fiber serves those static files in production.

---

# Validation Process

## Mandatory Quality Gate

After ANY code generation or modification:

1. Run all tests
2. Run linting
3. Execute:

```bash
go run quality_gate.go
```

The implementation is ONLY considered valid if:

- Tests pass
- Lint passes
- quality_gate.go passes
- No warnings remain unresolved

---

# Expected Commands

## Backend

```bash
go test ./...
go run quality_gate.go
```

## Frontend

```bash
npm test
npm run build
```

---

# Fiber Static Serving Rules

Production backend must expose:

```go
app.Static("/", "./web/dist")
```

SPA fallback must return:

```text
./web/dist/index.html
```

for unknown frontend routes.

---

# Pull Request Rules

Every change must:

- Include tests
- Pass quality gate
- Keep architecture consistency
- Avoid unrelated refactors
- Remain backward compatible unless explicitly required

---

# Agent Behavioral Rules

Agents working in this repository MUST:

- Prefer modifying existing code over rewriting everything
- Preserve project architecture
- Avoid introducing unnecessary dependencies
- Keep solutions simple
- Validate assumptions before implementation
- Never skip tests
- Never skip quality gate execution
- Never introduce dead code
- Never leave TODOs without explicit instruction

---

# Definition of Done

A task is only complete when:

- Tests exist
- Tests pass
- quality_gate.go passes
- Docker build succeeds
- Frontend build succeeds
- Code follows project architecture
- No linting issues remain
