# RevoBank API

Banking REST API built with NestJS, Prisma, and PostgreSQL.

## Live URL
https://milestone-4-dodyrokyimmanuelnrevobank-production.up.railway.app

## Swagger Documentation
https://milestone-4-dodyrokyimmanuelnrevobank-production.up.railway.app/api

## Features
- User registration and login with JWT authentication
- Bank account management (Create, Read, Update, Delete)
- Transactions: Deposit, Withdrawal, Transfer
- Role-based access (Customer / Admin)
- Input validation with class-validator
- API documentation with Swagger

## Technologies
- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL (hosted on Supabase)
- JWT Authentication
- Jest (unit testing)
- Railway (deployment)

## Local Setup

### Prerequisites
- Node.js 24+
- npm 11+

### Steps
1. Clone repository
   git clone https://github.com/Revou-FSSE-Oct25/milestone-4-DodyRokyImmanuelN
   cd revobank

2. Install dependencies
   npm install

3. Copy environment file
   cp .env.example .env
   # Edit .env and fill in your DATABASE_URL and JWT_SECRET

4. Run database migration
   npx prisma migrate dev

5. Start development server
   npm run start:dev

6. Open http://localhost:3000/api for Swagger documentation

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login

### User
- GET  /user/profile
- PATCH /user/profile

### Accounts
- POST   /accounts
- GET    /accounts
- GET    /accounts/:id
- PATCH  /accounts/:id
- DELETE /accounts/:id

### Transactions
- POST /transactions/deposit
- POST /transactions/withdraw
- POST /transactions/transfer
- GET  /transactions
- GET  /transactions/:id
```
