# webhook-payment-service
TypeScript plus Postgres service to handle payment webhooks with idempotency, transactions, and asynchronous processing

It ensures **idempotency**, safe **status transitions** (`sent → partially_paid → paid`), and wraps all operations in a **single transaction**.  

## Features
- **POST `/webhooks/payments`**
  - Records payment events
  - Enforces **idempotency** via DB unique constraint on `event_id`
  - Runs **insert + status update in one transaction**
  - Validates input → returns **4xx** on bad type, bad invoice, or non-positive amount
  - Updates invoice status:
    - `sent → partially_paid → paid` based on total payments

## Setup
1. Install dependencies:
   npm install

2. Configure .env:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/payments
PORT=3000
ASYNC_MODE=false   # true → use async queue

3. Start the service:

npm run dev