# PaisaaLens — Smart Expense Tracker for Indian Users

> **Full project specification (A → Z)**
>
> Detailed roadmap, architecture, database schemas with dummy data, API design, frontend structure, UI flows, deployment, CI/CD, testing, and production checklist.

---

## Table of Contents
1. Project Overview
2. Goals & Success Metrics
3. Target Users & User Stories
4. Core Features (MUST) and Advanced Features (NICE-to-HAVE)
5. Tech Stack
6. High-Level Architecture
7. Data Models & Dummy Data (JSON)
8. API Design (REST) — Routes, Request & Response Examples
9. Backend — Folder Structure & Important Modules
10. Frontend — Component Tree, Pages, State Management & Flows
11. UI/UX Wireframes & Behaviour
12. Integration: Bank CSV Parser & Auto-Categorization
13. AI/Insights & Rules Logic
14. Security Considerations
15. Testing Strategy
16. DevOps & Deployment (Production-ready)
17. CI/CD (GitHub Actions) Example
18. Monitoring & Observability
19. Production Checklist & Handover Notes
20. README + Resume Lines + Demo Script

---

## 1. Project Overview
**Name:** PaisaaLens (example)

**Description:** A personal finance intelligence platform tailored to Indian payment habits (UPI, EMIs, wallets). Tracks expenses, budgets, subscriptions, EMIs, and produces smart insights and monthly reports. Includes CSV bank statement parsing, auto-categorization, and lightweight AI-driven recommendations.

**Primary value proposition:** actionable insights and budgets personalized for Indian users, with minimal manual effort.

---

## 2. Goals & Success Metrics
**Goals:**
- Build a polished, deployable full-stack application demonstrating cloud deployment, CI/CD, authentication, and production-level features.
- Showcase ability to design systems, implement secure APIs, parse real bank statements, and ship AI-supported insights.

**Success Metrics:**
- Deploy app with 3 complete user stories implemented (Add Expense, Budget Alerts, CSV upload with auto-categorize).
- Unit tests with ≥70% coverage for backend critical modules.
- End-to-end flows tested and documented.
- Live demo link and clear README.

---

## 3. Target Users & User Stories
**Primary Users:**
- Young professionals in India (20–35) using UPI and bank transfers.
- College students managing limited budgets.

**Key User Stories (priority ordered):**
1. As a user, I can sign up and log in to manage my personal finances.
2. As a user, I can manually add expenses with category, payment method, date, description.
3. As a user, I can view monthly dashboard with charts (category distribution & trend).
4. As a user, I can set category budgets and receive notifications when nearing/exceeding limits.
5. As a user, I can upload my bank CSV and have transactions imported and auto-categorized.
6. As a user, I can add subscriptions and receive renewal reminders.
7. As a user, I can add EMI entries and see remaining balance + calendar.
8. As a user, I can view a monthly downloadable PDF report of finances.
9. As a user, I can see automated insights and suggestions (AI-generated).

---

## 4. Core Features (MUST) and Advanced Features (NICE-to-HAVE)

### Must-Have (MVP)
- User authentication (JWT, secure password hashing)
- Add/Edit/Delete Expense
- Dashboard with charts (monthly summary, top categories)
- Budgets per category + alerts
- Support common Indian payment methods (UPI, Cash, Netbanking, Wallet, Card)
- Subscription tracker (list, reminders)
- EMI tracker (schedule, remaining balance)
- Bank CSV upload & transaction parsing with auto-categorization
- Export monthly report as PDF
- Responsive UI (mobile-first)
- Deployment (frontend+backend) with HTTPS

### Nice-to-Have (Phase 2)
- AI-driven insights and personalized advice (via LLM or heuristics)
- Suggestions to reduce recurring costs
- OCR scanning of printed receipts (mobile camera)
- Multi-currency support (default INR)
- Shareable budget/summary for family members
- Offline mode (local cache)
- Social features – compare anonymized spending with peers (privacy aware)

---

## 5. Tech Stack
**Frontend:**
- React (preferably Next.js if SSR/SEO required)
- Tailwind CSS
- Recharts / Chart.js
- React Router (if using CRA) or Next.js routing
- Formik + Yup for forms

**Backend:**
- Node.js + Express
- TypeScript (recommended) or JavaScript
- Authentication: JWT
- Validation: Joi or Zod
- Email: SendGrid or nodemailer (for reminders)

**Database:**
- MongoDB Atlas (document store) — flexible for transactions
- Redis (optional) for caching/session store

**Storage:**
- AWS S3 (or DigitalOcean Spaces) for file uploads (CSV, receipts, PDFs)

**AI/ML (Optional):**
- OpenAI APIs for insights / recommendation generation or a lightweight rule engine

**DevOps / Hosting:**
- Frontend: Vercel (Next) or Netlify
- Backend: Render / Railway / Heroku / DigitalOcean App Platform
- Database: MongoDB Atlas
- CI/CD: GitHub Actions

**Infrastructure as Code (Optional):**
- Terraform for infra provisioning

---

## 6. High-Level Architecture

```
[User Device] --HTTPS--> [Frontend (Vercel/Netlify)]
                                |
                                v
                         [Backend API (Express on Render)]
                                |
                  ------------------------------
                  |             |               |
               [MongoDB]     [S3 Bucket]     [Redis (optional)]
```

Components:
- Frontend SPA – React + Tailwind
- Backend REST API – Node/Express
- Auth – JWT with refresh tokens (optional)
- Storage – S3 for CSV/PDF/receipts
- DB – MongoDB for users, expenses, budgets, subscriptions
- Background jobs – scheduled jobs for reminders (cron) via worker or serverless function

---

## 7. Data Models & Dummy Data (JSON)

> Use MongoDB collections. Below schema shown in simplified form (Mongoose-like).

### 1) `users` collection
```json
{
  "_id": "user_01",
  "name": "Vishal Singh",
  "email": "vishal@example.com",
  "passwordHash": "$2b$12$...",
  "currency": "INR",
  "monthlyIncome": 60000,
  "goals": [
    {"name": "Emergency Fund", "target": 100000, "saved": 20000}
  ],
  "createdAt": "2026-03-13T06:30:00Z"
}
```

### 2) `expenses` collection
```json
{
  "_id": "exp_0001",
  "userId": "user_01",
  "amount": 450,
  "currency": "INR",
  "category": "Food",
  "paymentMethod": "UPI",
  "description": "Dinner at Biryani House",
  "date": "2026-03-10T19:20:00Z",
  "merchant": "Biryani House",
  "tags": ["food", "dinner"],
  "createdAt": "2026-03-10T19:22:00Z"
}
```

### 3) `budgets` collection
```json
{
  "_id": "bud_1001",
  "userId": "user_01",
  "category": "Food",
  "monthlyLimit": 5000,
  "period": "2026-03",
  "spent": 3200
}
```

### 4) `subscriptions` collection
```json
{
  "_id": "sub_1",
  "userId": "user_01",
  "name": "Spotify",
  "amount": 149,
  "currency": "INR",
  "renewalDate": "2026-04-12",
  "frequency": "monthly",
  "paymentMethod": "UPI",
  "notes": "Family Plan"
}
```

### 5) `emis` collection
```json
{
  "_id": "emi_1",
  "userId": "user_01",
  "name": "iPhone 15 EMI",
  "principal": 60000,
  "emiAmount": 5000,
  "totalMonths": 12,
  "monthsPaid": 4,
  "startDate": "2025-12-01"
}
```

### 6) `transactions_uploads` collection
```json
{
  "_id": "upload_01",
  "userId": "user_01",
  "fileUrl": "s3://paisaa/uploads/user_01/march.csv",
  "status": "processed",
  "importedCount": 34,
  "rejectedCount": 2
}
```


---

## 8. API Design (REST) — Routes, Request & Response Examples

> Base URL: `https://api.paisaalens.app/v1`

### Authentication
- `POST /auth/register`
  - body: `{name, email, password, currency, monthlyIncome}`
  - response: `{user, token}`

- `POST /auth/login`
  - body: `{email, password}`
  - response: `{user, token}`

- `POST /auth/refresh` (if using refresh tokens)


### User
- `GET /users/me` — Get profile (auth)
- `PATCH /users/me` — Update profile


### Expenses
- `GET /expenses?start=2026-03-01&end=2026-03-31&page=1&limit=50` — list (auth)
- `GET /expenses/:id` — detail
- `POST /expenses` — create
  - body example:
  ```json
  {
    "amount": 450,
    "category": "Food",
    "paymentMethod": "UPI",
    "description": "Dinner at Biryani House",
    "merchant": "Biryani House",
    "date": "2026-03-10T19:20:00Z",
    "tags": ["food","dinner"]
  }
  ```
- `PATCH /expenses/:id` — update
- `DELETE /expenses/:id` — delete


### Budgets
- `GET /budgets?period=2026-03`
- `POST /budgets` — create/update
  - body: `{category, monthlyLimit, period}`


### Subscriptions
- `GET /subscriptions`
- `POST /subscriptions`
- `PATCH /subscriptions/:id`
- `DELETE /subscriptions/:id`


### EMIs
- `GET /emis`
- `POST /emis`
- `PATCH /emis/:id`
- `DELETE /emis/:id`


### Uploads (CSV)
- `POST /uploads/transactions` — multipart/form-data (file)
  - response: `{uploadId, status}`
- `GET /uploads/:uploadId/status`


### Reports
- `GET /reports/monthly?period=2026-03` — returns summarized data + link to PDF


### Insights
- `GET /insights?period=2026-03` — returns generated insights (heuristic or LLM)


### Example Response — Expenses List
```json
{
  "items": [
    {"_id":"exp_0001","amount":450,"category":"Food","date":"2026-03-10"},
    {"_id":"exp_0002","amount":1200,"category":"Groceries","date":"2026-03-09"}
  ],
  "page":1,
  "limit":50,
  "total":34
}
```

---

## 9. Backend — Folder Structure & Important Modules

```
backend/
├─ src/
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ expenses.controller.ts
│  │  ├─ budgets.controller.ts
│  │  └─ uploads.controller.ts
│  ├─ services/
│  │  ├─ auth.service.ts
│  │  ├─ expense.service.ts
│  │  ├─ csvParser.service.ts
│  │  └─ insight.service.ts
│  ├─ models/
│  │  ├─ user.model.ts
│  │  ├─ expense.model.ts
│  │  └─ budget.model.ts
│  ├─ middlewares/
│  │  ├─ auth.middleware.ts
│  │  ├─ error.middleware.ts
│  │  └─ validate.middleware.ts
│  ├─ utils/
│  │  ├─ logger.ts
│  │  └─ s3.ts
│  ├─ jobs/
│  │  ├─ reminders.job.ts
│  ├─ routes.ts
│  ├─ app.ts
│  └─ server.ts
├─ tests/
├─ .env
├─ package.json
└─ tsconfig.json
```

**Notes:**
- Keep controllers thin; business logic in services.
- Use dependency injection for easier testing.

---

## 10. Frontend — Component Tree, Pages, State Management & Flows

### Folder Structure (React)

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ auth/
│  │  │  ├─ LoginForm.jsx
│  │  │  └─ RegisterForm.jsx
│  │  ├─ dashboard/
│  │  │  ├─ SummaryCard.jsx
│  │  │  ├─ CategoryPieChart.jsx
│  │  │  └─ TrendLine.jsx
│  │  ├─ expenses/
│  │  │  ├─ ExpenseForm.jsx
│  │  │  └─ ExpenseList.jsx
│  │  ├─ subscriptions/
│  │  ├─ emi/
│  │  └─ common/
│  │     ├─ Modal.jsx
│  │     └─ ConfirmDialog.jsx
│  ├─ pages/
│  │  ├─ Dashboard.jsx
│  │  ├─ Expenses.jsx
│  │  ├─ Uploads.jsx
│  │  ├─ Subscriptions.jsx
│  │  ├─ Emi.jsx
│  │  └─ Settings.jsx
│  ├─ services/
│  │  └─ api.js
│  ├─ store/
│  │  └─ authSlice.js (Redux Toolkit) OR useContext
│  ├─ utils/
│  ├─ App.jsx
│  └─ index.jsx
```

### Pages & Flow
- **Auth Pages** — Register / Login -> redirect to Dashboard
- **Dashboard** — summary, charts, quick add expense
- **Expenses** — list, filter, search, add/edit expense
- **Uploads** — CSV Upload page with status and mapping correction UI
- **Subscriptions** — list & add subscriptions, set reminders
- **EMI** — list EMI schedule, remaining balance
- **Settings** — profile, currency, monthly income, linked accounts (optional)

### State Management
- **Auth** state: token, user
- **Expenses**: query cache by period; optimistic updates
- **UI**: theme (dark/light), modals

### UX Patterns
- Use skeleton loaders during API calls
- Paginate expense list
- Use modals for add/edit forms
- Accessible forms with proper labels

---

## 11. UI/UX Wireframes & Behaviour

**Key Screens** (brief descriptions):

### 1) Login / Register
- Simple form (Email, Password, Name)
- Social login optional

### 2) Dashboard (Default landing)
- Top: greeting, monthly summary (Income / Expense / Savings)
- Middle: charts — pie for categories, bar for week spend, line for trend
- Right side (or below on mobile): upcoming subscriptions, low budget alerts
- CTA: Quick Add Expense button (floating)

### 3) Add Expense Modal
- Fields: amount, category dropdown (with icons), paymentMethod, date picker, merchant, tags

### 4) Upload CSV Page
- Instructions with sample CSV template
- Upload + mapping UI (map columns to fields)
- Preview first 5 rows for confirmation

### 5) Subscription Page
- List view with next renewal date and quick pay link placeholder

### 6) Reports Page
- Select period, generate PDF button, download link

---

## 12. Integration: Bank CSV Parser & Auto-Categorization

**CSV Parser Steps:**
1. User uploads CSV to `/uploads/transactions` (multipart)
2. Backend validates CSV headers
3. Save file to S3 and create `transactions_uploads` record
4. Enqueue job to parse CSV (worker or background job)
5. For each row, normalize date & amount, identify merchant name
6. Use merchant rules + ML model or keyword mapping to categorize
7. Save parsed transactions to `expenses` collection with `source: "csv"` and `matched: true/false`
8. Return summary to user with `importedCount` and `rejectedCount`

**Auto-categorization Approaches:**
- **Heuristic rules:** regex or keyword matching for common merchants (e.g., "SWIGGY" -> Food).
- **Mapping table:** merchantName -> category, maintainable in DB.
- **ML model (optional):** small classifier using TF-IDF + Logistic Regression trained on sample transactions — good demonstration but optional.

**Mapping Correction UI:** Allow user to correct category for unmapped entries and update mapping table.

---

## 13. AI/Insights & Rules Logic

**Insight Types:**
- Spending anomalies (spent 25% more than average on Food)
- Savings recommendation (increase savings target)
- Subscription churn suggestions (unused subscriptions)
- Budget trend prediction (extrapolate end-of-month spend)

**Implementation Options:**
- **Heuristics:** quick wins for MVP (percent difference over rolling averages)
- **LLM-based:** send summarized data to OpenAI and request natural-language advice. Keep tokens low by sending aggregated numbers only.

**Example heuristic for "High Food Spend" insight:**
- For period P (month), calculate foodSpend(P).
- Calculate mean foodSpend over last 6 months M.
- If foodSpend(P) > M * 1.2 and foodSpend(P) > ₹3000 then generate insight.

**Example insight JSON**
```json
{
  "insightId": "ins_001",
  "type": "overspend",
  "title": "High food spending this month",
  "message": "You spent ₹5,200 on Food in March — that's 35% more than your 6-month average. Consider reducing dine-out frequency.",
  "recommendedActions": ["Set food budget to ₹4,000","Review last 10 food transactions"],
  "createdAt": "2026-03-13T07:00:00Z"
}
```

---

## 14. Security Considerations

- **Password storage:** bcrypt (salted hashing)
- **Authentication:** JWT with short expiry + refresh tokens stored in HttpOnly cookies (recommended for web)
- **Rate limiting:** per IP endpoints (especially uploads, auth)
- **Input validation:** Joi/Zod to sanitize input
- **File uploads:** validate MIME types, virus scan if possible
- **S3 access:** signed URLs, private buckets
- **Secrets:** store in environment variables or secret manager (don't commit `.env`)
- **CORS:** restrict origins to your frontend domain
- **HTTPS:** enforce HTTPS in production
- **Logging:** avoid logging PII (partial masked email)

---

## 15. Testing Strategy

**Unit tests:**
- Services (expense.service, csvParser)
- Auth flow

**Integration tests:**
- API endpoints with in-memory DB (MongoMemoryServer)

**E2E tests (optional):**
- Cypress for key flows: Register -> Add Expense -> Upload CSV -> Generate Report

**Test coverage target:**
- Critical backend logic ≥70%

---

## 16. DevOps & Deployment (Production-ready)

**Environment setup:**
- `NODE_ENV=production`
- `DATABASE_URL` (MongoDB Atlas URI)
- `JWT_SECRET`
- `S3_BUCKET`, `S3_KEY`, `S3_SECRET`
- `SENDGRID_API_KEY` (for emails)

**Deployment targets:**
- Frontend: Vercel (Next) or Netlify
- Backend: Render / Railway / Heroku / DigitalOcean App Platform
- DB: MongoDB Atlas

**Recommended architecture for production:**
- Backend: Dockerized service with health checks
- Autoscaling for backend
- CDN in front of frontend (Vercel has built-in)
- Use managed DB (Atlas) with backups

**Background jobs & Reminders:**
- Use separate worker or serverless functions (AWS Lambda + EventBridge or Heroku worker) to process CSV parsing and send email reminders

---

## 17. CI/CD (GitHub Actions) Example

**Pipeline steps:**
- On push to `main` run tests
- Build frontend bundle and deploy to Vercel
- Build backend docker image and deploy (or push to Render via git)

Sample workflow (simplified):

```yaml
name: CI
on: [push]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm ci && npm run test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm ci && npm run test
```

Add deployment jobs using provider-specific actions or use Vercel auto-deploy from the main branch.

---

## 18. Monitoring & Observability

- **Metrics & Logs:** Use CloudWatch / Datadog / LogDNA for backend logs and metrics.
- **Errors:** Sentry for runtime errors (frontend + backend)
- **Uptime:** UptimeRobot to ping health endpoint
- **Alerts:** Slack or email alerts on errors/cost spikes

---

## 19. Production Checklist & Handover Notes

**Before going live:**
- [ ] Environment variables configured
- [ ] HTTPS enforced
- [ ] Backups enabled for DB
- [ ] Health checks & monitoring in place
- [ ] Rate limiting enabled
- [ ] Privacy policy & terms added

**Handover docs:**
- Architecture diagram
- API docs (Swagger / Postman collection)
- Runbook for common issues
- Emergency contact & rollback steps

---

## 20. README + Resume Lines + Demo Script

### README (short template)

```md
# PaisaaLens
Smart expense tracker for Indian users. Live demo: <link>

## Features
- Add expenses, budgets, subscriptions, EMI tracking
- Bank CSV upload with auto-categorization
- Dashboard with charts & AI-driven insights

## Tech
React, Node.js, MongoDB, Tailwind, Chart.js

## Run locally
1. `cd backend`
2. `npm ci && npm run dev`
3. `cd frontend`
4. `npm ci && npm run dev`

```

### Resume lines (choose 2-3 concise bullets)
- Built **PaisaaLens**, a full-stack personal finance app tailored for Indian payment habits (UPI, EMI, subscriptions). Implemented CSV bank uploads, automated categorization, and a dashboard with budget alerts. (React, Node.js, MongoDB)
- Implemented server-side CSV parsing and mapping system to auto-categorize transactions into India-specific categories, improving import accuracy.
- Deployed app to Vercel + Render with CI/CD pipeline and added monitoring and alerting for production stability.

### Demo Script (2–3 minute elevator demo)
- Landing: explain the problem & who it's for (20s)
- Quick login & dashboard walkthrough (40s)
- CSV upload & import -> show auto-categorization (30s)
- Budget set & alert triggered (20s)
- Show insights & monthly report download (30s)

---

## Appendix: Example CSV Template (Banks/UPI)

```
date,narration,amount,type,balance
2026-03-01,UPI-ICICI-123456,250.00,DR,45000.00
2026-03-02,Salary-XYZ,60000.00,CR,105000.00
2026-03-03,ATM Withdrawal,2000.00,DR,103000.00
```

---

## Next Steps — Suggested 4-week implementation plan

**Week 1**
- Project setup (frontend + backend)
- Auth endpoints, basic UI, DB models for users & expenses

**Week 2**
- Add expense flows, dashboard basic charts
- Budgets & alerts (simple)

**Week 3**
- CSV upload + background parsing + mapping UI
- Subscriptions & EMI models

**Week 4**
- Insights engine (heuristics), PDF reports, deploy to staging
- Prepare README, record demo

---

If you want, I can now:
- Generate the **complete Postman collection** for APIs,
- Produce **Mongoose / Prisma schema files** for the data models,
- Scaffold the **React components** and server stubs with code templates,
- Or create a **Gantt-style milestone plan** with tasks and estimated hours.


Good luck — this specification is intentionally detailed so you can implement a production-grade portfolio project that recruiters will notice.

