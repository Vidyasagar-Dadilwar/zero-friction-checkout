# Zero-Friction Checkout System (Scan → Pay → Exit)

A backend-first, state-driven checkout system designed to eliminate physical billing queues in retail stores.  
The project focuses on **correctness under retries, partial failures, and concurrency**, rather than UI polish.

---

## 📌 Problem Statement

Physical retail checkout queues are inefficient and error-prone.  
Most “self-checkout” solutions fail due to weak backend guarantees such as double payments, race conditions, or poor state handling.

This project explores how a **queue-less checkout flow** can be safely implemented by enforcing strict backend state transitions and idempotent payment handling.

---

## 🎯 Design Goals

- Backend-driven authority (never trust the client)
- One-way state transitions
- Idempotent payment processing
- Safe handling of retries and failures
- Minimal role permissions
- Automatic cleanup without cron jobs

---

## 🧠 High-Level Architecture

**Client (Web / Mobile Browser)**  
→ **Node.js + Express Backend**  
→ **MongoDB**  
→ **Payment Provider (Mocked Webhook)**  
→ **Guard Verification Flow**

The backend is divided into logical modules:
- Authentication & Roles
- Cart State Machine
- Payment & Webhook Processing
- Exit Token Verification

---

## 🔐 Authentication Model

- Passwordless authentication using phone number (OTP mocked)
- JWT stored in HTTP-only cookies
- Roles:
  - `USER` – shopping and payment
  - `GUARD` – exit verification only
  - `ADMIN` – reserved (not implemented)

The backend **never** accepts user identity from the request body.

---

## 🛒 Cart Lifecycle (State Machine)

Each user can have **at most one ACTIVE cart**.

ACTIVE → LOCKED → PAID


### State Rules
- `ACTIVE`
  - Items can be added/updated
- `LOCKED`
  - Cart becomes immutable
  - Payment can be initiated
- `PAID`
  - Terminal state
  - No further modifications allowed

Abandoned carts are automatically removed using **MongoDB TTL indexes**.

---

## 💳 Payment Flow (Idempotent by Design)

1. User locks the cart
2. Backend creates **one payment per cart**
3. Payment provider calls webhook (can retry multiple times)
4. Backend:
   - Verifies payment
   - Marks payment `SUCCESS` exactly once
   - Transitions cart from `LOCKED → PAID`
   - Generates exit token

### Why Idempotency Matters
Payment providers retry webhooks on network failure.  
This system guarantees that **duplicate webhook calls do not corrupt state**.

---

## 🚪 Exit Token System

After successful payment, the backend generates a **single-use, time-bound exit token**.

### Token Properties
- Server-generated
- Stored in database
- Single-use
- Automatically expires (TTL index)

### Guard Verification Flow
- Guard scans token
- Backend validates:
  - Token exists
  - Not expired
  - Not already used
- Token is immediately marked as used

Guards have **no access** to carts or payments.

---

## 🗄️ Database Design (MongoDB)

### Collections
- `users`
- `products`
- `carts`
- `payments`
- `exitTokens`

### Key Design Choice
MongoDB TTL indexes are used to:
- Auto-delete expired carts
- Auto-delete unused exit tokens

This removes the need for background cron jobs.

---

## ⚠️ Failure Scenarios Handled

- User closes browser during payment
- Duplicate webhook calls
- Payment retries
- Cart abandoned mid-checkout
- Exit token reuse attempt
- Expired exit token

All scenarios result in **safe, predictable backend behavior**.

---

## 🚫 Intentional Omissions

The following are intentionally **out of scope** to keep the project focused:

- Real payment gateway signature verification
- Inventory deduction
- Admin dashboards
- Notifications
- Production UI polish
- Deployment configuration

The goal is **backend correctness**, not feature breadth.

---

## 🧪 Testing Strategy

- Manual API testing via Postman
- Database verification using MongoDB Compass
- Explicit testing of:
  - State transitions
  - Duplicate webhook handling
  - Token reuse prevention
  - TTL expiration behavior

---

## 🧩 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie-based sessions

---

## 🧠 Key Engineering Takeaways

- State machines simplify complex workflows
- Idempotency is critical in payment systems
- Backend must remain authoritative
- TTL indexes are powerful for self-cleaning systems
- Role isolation reduces blast radius

---

## 📌 Project Status

**Functionally complete.**  
Further additions would focus on presentation or deployment, not core logic.

---

## 📄 License

This project is for educational and demonstration purposes.