# Makefile for Lugabus List project
# Automates Docker Compose commands for Dev and Prod environments

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment (foreground)"
	@echo "  make dev-d        - Start development environment (detached)"
	@echo "  make prod         - Start production environment (detached)"
	@echo "  make build-dev    - Build development images"
	@echo "  make build-prod   - Build production images"
	@echo "  make down         - Stop and remove all containers"
	@echo "  make logs         - View output logs (follow)"
	@echo "  make shell-back   - Open shell in backend container"
	@echo "  make ci           - Run CI checks locally (pnpm)"
	@echo "  make ci-docker    - Run CI checks in Docker"

# Development
.PHONY: dev
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

.PHONY: dev-d
dev-d:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

.PHONY: build-dev
build-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

# Production
.PHONY: prod
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

.PHONY: build-prod
build-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Utils
.PHONY: down
down:
	docker-compose down --remove-orphans

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: shell-back
shell-back:
	docker-compose exec backend sh

# CI
.PHONY: ci
ci:
	pnpm install --frozen-lockfile
	pnpm run local-ci

.PHONY: ci-docker
ci-docker:
	docker-compose -f docker-compose.ci.yml run --rm ci
