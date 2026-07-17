# 🚀 GearUp Backend API

A production-ready RESTful backend API for **GearUp**, a sports and outdoor equipment rental platform. The system allows customers to rent equipment, providers to manage their gear inventory, and administrators to oversee the entire platform.

Built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**, the API includes secure authentication, role-based authorization, Stripe payment integration, reviews, dashboards, and analytics.

---

# ✨ Features

## Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Role-Based Authorization (Customer, Provider, Admin)
* Password Hashing with bcrypt

---

## Category Management

* Create Category
* Update Category
* Delete Category
* Get All Categories

---

## Gear Management

* Create Gear
* Update Gear
* Delete Gear
* Get All Gear
* Get Single Gear
* Search by Title
* Filter by Category
* Filter by Brand
* Filter by Availability
* Filter by Price Range
* Pagination
* Sorting

---

## Rental Management

* Create Rental
* View Customer Rentals
* View Provider Rentals
* Update Rental Status
* Automatic Stock Management
* Automatic Availability Update
* Rental Status Validation

---

## Payment

* Stripe Checkout
* Stripe Webhook
* Payment History
* Payment Details
* Automatic Rental Status Update
* Payment Record Management

---

## Review System

* Add Review
* View Reviews
* Rating Validation
* Returned Rental Verification

---

## Dashboard & Analytics

### Customer Dashboard

* Rental Summary
* Active Rentals
* Completed Rentals
* Recent Rentals

### Provider Dashboard

* Revenue
* Recent Rentals
* Recent Reviews
* Analytics

### Admin Dashboard

* User Statistics
* Revenue Analytics
* Rental Analytics
* Top Rented Gear
* Top Rated Gear
* Monthly Revenue
* Monthly User Registration
* Category Statistics

---

# 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT
* bcrypt

### Validation

* Zod

### Payment Gateway

* Stripe

### Development Tools

* ts-node-dev
* ESLint
* Prettier

---

# 📁 Project Structure

```text
src/
│
├── app/
│   ├── config/
│   ├── errors/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── gear/
│   │   ├── rental/
│   │   ├── payment/
│   │   ├── review/
│   │   └── dashboard/
│   ├── routes/
│   └── utils/
│
├── server.ts
└── app.ts
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/your-username/gearup-backend.git
```

## 2. Navigate to the project

```bash
cd gearup-backend
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create a .env file

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=your_stripe_secret_key

STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLIENT_URL=http://localhost:3000
```

## 5. Run database migrations

```bash
npx prisma migrate dev
```

## 6. Generate Prisma Client

```bash
npx prisma generate
```

## 7. Start the development server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

---

# 📌 API Base URL

```text
http://localhost:5000/api/v1
```

---

# 📖 API Endpoints

## Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |

---

## Category

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /categories     |
| GET    | /categories     |
| PATCH  | /categories/:id |
| DELETE | /categories/:id |

---

## Gear

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /provider/gear     |
| PATCH  | /provider/gear/:id |
| DELETE | /provider/gear/:id |
| GET    | /gear              |
| GET    | /gear/:id          |

---

## Rentals

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /rentals            |
| GET    | /rentals/my-rentals |
| GET    | /provider/rentals   |
| PATCH  | /rentals/:id/status |

---

## Payments

| Method | Endpoint                          |
| ------ | --------------------------------- |
| POST   | /payments/create-checkout-session |
| POST   | /payments/webhook                 |
| GET    | /payments/my-payments             |
| GET    | /payments/:id                     |

---

## Reviews

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /reviews              |
| GET    | /reviews/gear/:gearId |

---

## Dashboard

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | /dashboard/customer |
| GET    | /dashboard/provider |
| GET    | /dashboard/admin    |

---

# 🔐 Environment Variables

Create a **.env** file in the project root.

```env
PORT=

DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
```

---

# 👤 Admin Credentials

Update these credentials according to your seeded admin account.

```text
Email: john@example.com

Password: 123456
```

---

# 🌐 Live Url: https://gearup-backend-wheat.vercel.app/

---

# 🚀 Running Tests

```bash
npm run dev
```

---

# 📦 Build

```bash
npm run build
```