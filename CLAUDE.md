# QuickEats Project Context & Architecture Guidelines

## Architecture Overview
QuickEats is a microservices-based application built with NestJS (backend) and Next.js (frontend).
- **API Gateway**: Running natively or containerized on port `3001`. Orchestrates routes for all microservices.
- **Frontend Client**: Next.js App Router running on port `3000`. Uses native LocalStorage flags (`isLoggedIn`, `userId`, `role`) for light UI session synchronization.
- **Auth Service**: Manages secure sessions via HttpOnly Cookies.
- **Restaurant Service**: Handles catalogs, products, and categories (port `3003`).
- **Order Service**: Coordinates order management and processing (port `3004`).

## Coding Standards & Rules
- **No Floating Text / Formatting**: Always enforce TypeScript strict types. Avoid using any external libraries for JWT parsing on the client side.
- **State Management**: Local shopping cart data is persisted via `localStorage` under the key `quickeats_cart`.
- **Styling**: Tailwind CSS with standard configuration. Keep UI components highly scannable and modular.

## AI Chatbot Feature Specifications
We are implementing an **Interactive AI Agent (Function Calling)** embedded into the API Gateway under the route `POST /ai/chat`.
- **Target Model**: `llama-3.1-8b-instant` via Groq (OpenAI-compatible client, `baseURL: https://api.groq.com/openai/v1`, `GROQ_API_KEY`). We migrated off Gemini — `@google/generative-ai` may still linger as an unused dependency in `gateway/package.json`, but it is not what powers the chatbot; do not build against it.
- **Expected Tools**:
  1. `get_order_status(orderId: string)` -> Fetches from Order Service.
  2. `add_product_to_cart(productName: string, quantity: number)` -> Searches Restaurant Service for valid IDs and returns an action payload (`{ type: 'action', action: 'ADD_TO_CART', payload }`) to the frontend.

## Operational Constraints
- DO NOT run production build or install packages globally unless explicitly requested.
- Prioritize standalone modular modifications over massive multi-file refactors.

## CI/CD & Environment Separation
- `.github/workflows/ci-cd.yml` triggers on `main` only: builds and pushes all six service images to ACR (`crquickeats.azurecr.io`) tagged `:latest`. It does **not** run `az containerapp update` — no Container App is auto-redeployed on push; promoting a `:latest` image to a running app is a manual `az containerapp update`.
- `.github/workflows/ci-cd-develop.yml` triggers on `develop` only: builds and pushes the same six images tagged `:dev`. Same as above, no automatic `az containerapp update`.
- **Azure infra now has two parallel app sets in the same Container Apps Environment** (`managedEnvironment-rgquickeatsdev-b22e`, region East US 2 — the subscription is capped at 1 environment per region, so true environment-level isolation wasn't possible; apps are isolated by resource group + naming instead):
  - **`rg-quickeats-dev`** (original apps, unsuffixed names: `ca-frontend`, `ca-gateway`, `ca-auth-service`, `ca-restaurant-service`, `ca-order-service`, `ca-notification-service`). Still on `:latest` and still serving the original public URLs (`ca-frontend.braveground-047a1b6e.eastus2.azurecontainerapps.io`, `ca-gateway.braveground-047a1b6e...`). Cutover of these to `:dev` was intentionally **not** done — those URLs are already shared with the team, so the switch needs explicit coordination first.
  - **`rg-quickeats-prod`** (new, `-prod`-suffixed names: `ca-frontend-prod`, `ca-gateway-prod`, `ca-auth-service-prod`, `ca-restaurant-service-prod`, `ca-order-service-prod`, `ca-notification-service-prod`). Backends run `crquickeats.azurecr.io/*-service:latest` / `gateway:latest`; internal service-to-service calls use Container Apps' short-name DNS scoped per environment, rewired to the `-prod` names (e.g. gateway's `AUTH_SERVICE_URL=http://ca-auth-service-prod`). Public URL: `https://ca-gateway-prod.braveground-047a1b6e.eastus2.azurecontainerapps.io`.
  - **Frontend build-arg gotcha**: `NEXT_PUBLIC_API_URL` is inlined into the static JS bundle at `docker build` time (Next.js), not read at container runtime. Because of that, `ca-frontend-prod` runs a **separately built image** (`crquickeats.azurecr.io/frontend:prod`, NOT `:latest`) with `NEXT_PUBLIC_API_URL` baked to the `ca-gateway-prod` URL. `ci-cd.yml`'s frontend build-arg was updated permanently to point at `ca-gateway-prod` so future `main` builds stay correct for this new prod target.
- **Pending**: decide when/how to cut the original `rg-quickeats-dev` apps over to `:dev` (coordinate with the team since their public URLs are already shared), and consider whether `rg-quickeats-dev`'s images should eventually be rebuilt/retagged to make the naming (`-dev` RG serving `:dev` tag) match reality.