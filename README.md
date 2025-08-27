# webhook-payment-service
TypeScript plus Postgres service to handle payment webhooks with idempotency, transactions, and asynchronous processing

It ensures **idempotency**, safe **status transitions** (`sent → partially_paid → paid`), and wraps all operations in a **single transaction**.  

Implemented a simple worker (queue/actor pattern) that processes events asynchronously and retries on failure. This ensures pending events are processed even if the server was temporarily down.

This makes the service resilient against replay attacks, transient errors, and downtime, while keeping invoices in a consistent state.

# PROJECT STRUCTURE
src/
  db.ts                   -----> Sequelize connection
  models/
    Invoice.ts            -----> Invoices model
    Payment.ts            -----> Payments model (with event_id unique constraint)
    PaymentEvent.ts       -----> Queue model (for async mode)
 services/
    applyPaymentEvent.ts  -----> Transactional business logic
 routes/
    webhooks-sync.ts      -----> POST /webhooks-sync/payments
    webhooks.ts           -----> POST /webhooks/payments
 worker.ts                -----> Async queue processor
 app.ts                   -----> Express app
 server.ts                -----> Entry point
.env
package.json
README.md
tsconfig.json

# Database Schema

The database consists of three main tables:

1. Invoices – stores invoice data and status.
2. Payments – records all applied payments.
3. PaymentEvents – queue table for async processing.

# Setup
1. Install dependencies:
   npm install

2. Configure .env:

3. Start the service:
   npm run dev

4. How to Run the Worker

Keep your main app running (npm run dev), then in another terminal run:
ts-node src/worker.ts or npm run worker

Requests to /webhooks/payments will just insert a row into PaymentEvent with status = 'pending'.
The worker polls the DB every 5 seconds and applies those payments.

## Features
- **POST `/webhooks/payments`**
  - Records payment events
  - Enforces **idempotency** via DB unique constraint on `event_id`
  - Runs **insert + status update in one transaction**
  - Validates input → returns **4xx** on bad type, bad invoice, or non-positive amount
  - Updates invoice status:
    - `sent → partially_paid → paid` based on total payments



## Query to add data in Invoice table 
INSERT INTO "Invoices" (id, amount, status) VALUES (1, 10000, 'sent');

## Endpoints
1. POST /webhooks-sync/payments
Synchronous endpoint — immediately applies payment to invoice.
Request body example:
{
  "event_id": "event_12345",
  "invoice_id": 1,
  "amount": 5000
}

2. POST /webhooks/payments
Asynchronous endpoint — enqueues the event for background processing.
Worker (worker.ts) picks up pending events and applies payments reliably.


