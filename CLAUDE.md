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