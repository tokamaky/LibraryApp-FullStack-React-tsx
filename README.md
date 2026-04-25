
# 📚 Jerry Library — Full-Stack Library Management System

> **A production-grade, full-stack library management platform** with secure authentication (Okta OAuth2 + JWT), Stripe-powered fee payments, role-based admin tools, and a polished React + TypeScript frontend.

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-2.7-6DB33F?logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Security-OAuth2-6DB33F?logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/Okta-OAuth2/JWT-007DC1?logo=okta&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Data_JPA-Hibernate-59666C?logo=hibernate&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_HATEOAS-REST-6DB33F?logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white" />
</p>

---

## 🌐 Live Demo

👉 **[https://jerrylibrary.up.railway.app](https://jerrylibrary.up.railway.app)**

> **Try it as a user**: browse books, checkout, leave reviews, ask the librarian a question.
> **Try it as an admin**: log in with an admin Okta account → add/delete books, answer messages, view loan analytics.

---

## 📌 Project Overview

Jerry Library is more than a CRUD demo — it's a **realistic SaaS-style library platform** with the kind of cross-cutting concerns recruiters actually care about:

- 🔐 **Real authentication** with Okta as the identity provider — not a hand-rolled `BCryptPasswordEncoder` toy
- 💳 **Real payments** via Stripe Payment Intents — handles 3-D Secure flow correctly
- 👮 **Real authorization** — `/api/**/secure/**` routes enforced by Spring Security's OAuth2 resource server
- 🏗️ **Real architecture** — proper layering (Controller → Service → Repository → Entity) with `@Projection`-based HATEOAS REST exposure
- 🐳 **Real DevOps** — multi-container Docker Compose for local + Railway deployment for production

---

## 🏗️ System Architecture

```
                ┌──────────────────────────────────────────┐
                │   React 18 + TypeScript Frontend         │
                │   ──────────────────────────────────     │
                │   • Okta Sign-In Widget (login flow)     │
                │   • Stripe.js + react-stripe-js          │
                │   • react-router-dom v5 (SPA routing)    │
                │   • CSS Modules + Bootstrap              │
                └────────────────┬─────────────────────────┘
                                 │  HTTPS + JWT Bearer
                                 ▼
        ┌────────────────────────────────────────────────────┐
        │   Spring Boot 2.7 Backend                          │
        │   ──────────────────────────────────────────────   │
        │   ┌──────────────────────────────────────────────┐ │
        │   │  Spring Security: OAuth2 Resource Server     │ │
        │   │  - JWT validation (Okta issuer)              │ │
        │   │  - /api/**/secure/** → authenticated only    │ │
        │   │  - admin role check via JWT claim            │ │
        │   └──────────────────────────────────────────────┘ │
        │                                                    │
        │   Controllers ──► Services ──► JPA Repositories    │
        │   ────────────                                     │
        │   • BookController        (catalog + checkout)     │
        │   • ReviewController      (5-star reviews)         │
        │   • MessagesController    (Q&A board)              │
        │   • AdminController       (RBAC-protected)         │
        │   • PaymentController     (Stripe integration)     │
        │                                                    │
        │   Spring Data REST + HATEOAS                       │
        │   • Auto-generated /api/books, /api/reviews HAL    │
        │   • Custom @RepositoryRestResource projections     │
        └────────────────┬───────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐          ┌─────────┐
        │  MySQL 8 │          │ Stripe  │
        │  (JPA)   │          │   API   │
        │  6 tables│          └─────────┘
        └──────────┘
              ▲
              │ login flow
              │
        ┌──────────┐
        │   Okta   │
        │ Identity │
        │ Provider │
        └──────────┘
```

---

## ✨ Feature Tour

### 👤 For Users
- 🔍 **Browse & search** the catalog (title, author, category)
- 📖 **Checkout** up to 5 books at once
- 🔁 **Renew loans** if no holds are pending
- ⭐ **Leave 5-star reviews** with prose feedback
- 💬 **Ask the librarian** via the messages board
- 💳 **Pay overdue fees** with Stripe (full 3-D Secure support)
- 📊 **My shelf** — see current loans, history, and review activity

### 🛠️ For Admins
- ➕ Add new books to the catalog (title, author, copies, image URL, category)
- 🗑️ Increase / decrease available copies
- ❌ Delete books (also cascades reviews + history)
- 💬 Answer user questions from the message inbox
- 🔒 Routes guarded by **JWT role claim** — checked declaratively in `SecurityConfiguration` + procedurally in `AdminService`

### 🔐 Authentication & Authorization
This project uses **Okta as the identity provider** (not a hand-rolled JWT system):

```
1. User clicks "Sign In" → Okta-hosted widget
2. Okta returns an access token (JWT) signed with its private key
3. Frontend stores the token and attaches it to every API request
4. Spring Security validates each request:
   - Verifies signature against Okta's JWKS endpoint
   - Checks `iss` claim matches the configured Okta org
   - Extracts the user email from the `sub` claim
5. Admin endpoints additionally check the role claim
```

The backend's `ExtractJWT` utility decodes specific claims (e.g., `sub` for the user's email) when needed without re-validating — relying on Spring Security to have already done that upstream.

### 💳 Stripe Integration (Payment Intents API)
Modern, SCA-ready payment flow:

```
1. User has unpaid fees → /api/payment/secure/payment-intent (POST)
2. Backend creates a Stripe PaymentIntent in the configured currency
3. Backend returns the client_secret to the frontend
4. Frontend confirms the payment via @stripe/react-stripe-js
5. On success → /api/payment/secure/payment-complete (PUT)
6. Backend zeroes out the user's outstanding balance
```

---

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | React 18, TypeScript 4.9, react-router-dom 5, Bootstrap, Stripe.js, Okta Sign-In Widget |
| **Backend** | Spring Boot 2.7, Spring Security (OAuth2 Resource Server), Spring Data JPA + Hibernate, Spring Data REST (HATEOAS), Lombok |
| **Auth** | Okta OAuth 2.0 / OIDC + JWT |
| **Payments** | Stripe Java SDK 22.0 (Payment Intents API) |
| **Database** | MySQL 8, JPA / Hibernate ORM |
| **Build** | Maven (backend), npm + Create React App (frontend) |
| **DevOps** | Docker (multi-stage), Docker Compose, Railway |

---

## 📁 Project Structure

```
LibraryApp-FullStack-React-tsx/
│
├── 01-starter-files/
│   ├── App.css                       # Original CRA stylesheet
│   ├── Images/                       # Book cover assets
│   └── Scripts/                      # ⭐ DB seed scripts
│       ├── 1-React-Springboot-Add-Tables-Script.sql
│       ├── React-SpringBoot-Add-Books-Script-{2,3,4,5}.sql
│       └── Payment Script
│
├── 02-backend/spring-boot-library/   # ⚙️  Spring Boot API
│   ├── src/main/java/com/JerryLibrary/springbootlibrary/
│   │   ├── SpringBootLibraryApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfiguration.java   # ⭐ OAuth2 resource server
│   │   │   └── MyDataRestConfig.java        # HATEOAS exposure rules
│   │   ├── controller/                      # 5 REST controllers
│   │   │   ├── BookController.java
│   │   │   ├── ReviewController.java
│   │   │   ├── MessagesController.java
│   │   │   ├── AdminController.java
│   │   │   └── PaymentController.java
│   │   ├── service/                         # Business logic
│   │   ├── dao/                             # 6 JPA repositories
│   │   ├── entity/                          # 6 @Entity classes
│   │   │   ├── Book.java
│   │   │   ├── Checkout.java
│   │   │   ├── History.java
│   │   │   ├── Message.java
│   │   │   ├── Payment.java
│   │   │   └── Review.java
│   │   ├── requestmodels/                   # DTOs for POST/PUT bodies
│   │   ├── responsemodels/                  # Composite response DTOs
│   │   └── utils/
│   │       └── ExtractJWT.java              # Decode claims from Bearer token
│   ├── Dockerfile
│   └── pom.xml
│
├── 03-frontend/react-library/        # 🖥️  React TypeScript SPA
│   ├── src/
│   │   ├── App.tsx                          # Top-level routing
│   │   ├── lib/
│   │   │   └── oktaConfig.ts                # Okta OIDC config
│   │   ├── Auth/                            # Sign-in widget integration
│   │   ├── layouts/
│   │   │   ├── HomePage/
│   │   │   ├── NavbarAndFooter/
│   │   │   ├── SearchBooksPage/
│   │   │   ├── BookCheckoutPage/
│   │   │   ├── ShelfPage/                   # User's loans + history + reviews
│   │   │   ├── MessagesPage/                # Q&A board
│   │   │   ├── ManageLibraryPage/           # Admin console (RBAC-gated)
│   │   │   ├── PaymentPage/                 # Stripe Elements
│   │   │   └── Utils/                       # Pagination, SpinnerLoading…
│   │   └── models/                          # TypeScript domain models
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml                # 🐳 db + backend + frontend
└── README.md
```

---

## 🗄️ Data Model

| Entity | Key fields | Relationships |
|---|---|---|
| `Book` | id, title, author, copies, copies_available, category, img | 1 ⟷ N `Review`, `Checkout`, `History` |
| `Checkout` | id, user_email, book_id, checkout_date, return_date | references Book by `book_id` |
| `History` | id, user_email, book_id, checkout_date, returned_date | archive of past loans |
| `Review` | id, user_email, date, rating (1–5), book_id, review_description | one per user per book |
| `Message` | id, user_email, title, question, response, admin_email, closed | Q&A thread |
| `Payment` | id, user_email, amount | overdue fee balance |

---

## 🚀 Quick Start

### Option A — Docker Compose (recommended)

```bash
git clone https://github.com/your-username/LibraryApp-FullStack-React-tsx.git
cd LibraryApp-FullStack-React-tsx
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | https://localhost:3000 |
| Backend | https://localhost:8443/api |
| MySQL | localhost:3306 |

The MySQL container auto-runs every `*.sql` in `01-starter-files/Scripts/` on first boot.

### Option B — Local development

**1. Database**
```bash
mysql -uroot -p
CREATE DATABASE reactlibrarydatabase;
mysql -uroot -p reactlibrarydatabase < 01-starter-files/Scripts/1-React-Springboot-Add-Tables-Script.sql
mysql -uroot -p reactlibrarydatabase < 01-starter-files/Scripts/React-SpringBoot-Add-Books-Script-2.sql
# … run the rest of the seed scripts
```

**2. Backend**
```bash
cd 02-backend/spring-boot-library
# Configure src/main/resources/application.properties:
#   spring.datasource.url, username, password
#   okta.oauth2.client-id, okta.oauth2.issuer
#   stripe.key.secret
./mvnw spring-boot:run                # http://localhost:8443
```

**3. Frontend**
```bash
cd 03-frontend/react-library
npm install
# Configure src/lib/oktaConfig.ts with your Okta tenant
# Configure src/lib/StripePublicKey.ts with your Stripe publishable key
npm start                             # https://localhost:3000
```

---

## 🔧 Required External Services

This project depends on three SaaS providers — all have generous free tiers for development:

| Service | What you need | Where to get it |
|---|---|---|
| **Okta** | Client ID + Issuer URL | [developer.okta.com](https://developer.okta.com) — free dev account |
| **Stripe** | Publishable + Secret keys (test mode) | [stripe.com/dashboard](https://dashboard.stripe.com) |
| **MySQL** | Local server or Docker container | Docker Compose handles this for you |

> The `docker-compose.yml` in this repo includes example Okta + Stripe values for the live demo — replace them with your own credentials.

---

## 🔌 API Reference (selected)

### Books (public)
```
GET  /api/books?page=0&size=9                             Paginated list
GET  /api/books/search/findByTitleContaining?title=harry  Search
GET  /api/books/search/findByCategory?category=FE         Filter by category
```

### Books (authenticated)
```
GET  /api/books/secure/currentloans                       My current loans
GET  /api/books/secure/currentloans/count                 Count
GET  /api/books/secure/ischeckedout/byuser?bookId=1       Have I checked this out?
PUT  /api/books/secure/checkout?bookId=1                  Checkout a book
PUT  /api/books/secure/return?bookId=1                    Return
PUT  /api/books/secure/renew/loan?bookId=1                Renew (if no holds)
```

### Reviews
```
GET  /api/reviews/search/findByBookId?bookId=1            Reviews for a book
GET  /api/reviews/secure/user/book?bookId=1               Have I reviewed this?
POST /api/reviews/secure                                  Submit a review
```

### Messages (Q&A)
```
GET  /api/messages/search/findByUserEmail                 My questions
POST /api/messages/secure/add/message                     Ask a question
PUT  /api/messages/secure/admin/message                   (Admin) answer
```

### Admin (admin role required)
```
POST   /api/admin/secure/add/book                         Add a new book
PUT    /api/admin/secure/increase/book/quantity?bookId=1  +1 copy
PUT    /api/admin/secure/decrease/book/quantity?bookId=1  -1 copy
DELETE /api/admin/secure/delete/book?bookId=1             Delete (cascades)
```

### Payments
```
POST /api/payment/secure/payment-intent                   Create Stripe PaymentIntent
PUT  /api/payment/secure/payment-complete                 Mark fees as paid
```

---

## 🏆 Engineering Highlights (for recruiters)

| # | Highlight | Why it matters |
|---|---|---|
| 1 | **OAuth2 + OIDC with a real IdP (Okta)** — not a hand-rolled JWT system | Demonstrates understanding of industry-standard auth, JWKS, claim validation |
| 2 | **Stripe Payment Intents API** with 3-D Secure | Real money, real complexity — far beyond the toy "checkout demo" |
| 3 | **Spring Data REST + HATEOAS** with `MyDataRestConfig` | Auto-generated paginated endpoints with controlled exposure |
| 4 | **6 entities, 6 repositories, proper layering** | Production-style separation of concerns (Controller → Service → DAO) |
| 5 | **Custom RBAC via JWT role claim** in `SecurityConfiguration` | Declarative + procedural authorization |
| 6 | **Multi-container Docker Compose** with environment-based config | Reproducible local dev for any teammate in one command |
| 7 | **HTTPS in development** via self-signed certs | Exercises TLS-aware code paths that often hide bugs in plain-HTTP demos |
| 8 | **Pagination + filtering on the catalog endpoint** | Real-world query design, not `findAll()` returning 10k rows |
| 9 | **Cascade delete with care** — book deletion also clears reviews + history | Shows attention to referential integrity |
| 10 | **Deployed to Railway** with isolated services | End-to-end DevOps, including TLS termination + custom domains |

---

## 📸 Screenshots

> *(Add screenshots: home page, book catalog, checkout flow, Stripe payment modal, admin panel.)*

---

## 🛣️ Roadmap

- [ ] Migrate from `react-router-dom` v5 → v6
- [ ] Replace Create React App with Vite for faster builds
- [ ] Add Postgres support alongside MySQL (Hibernate dialect switch)
- [ ] Cypress end-to-end tests for the checkout flow
- [ ] WebSocket notifications when an admin answers a question
- [ ] Migrate Okta → self-hosted Keycloak (cost reduction at scale)
- [ ] Migrate to Spring Boot 3.x + Java 21

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ — <a href="mailto:your-email@example.com">Get in touch</a>
</p>


```bash
The server will be loaded at localhost:5000.
The client will be loaded at localhost:3000.
```

Explore the source code to see how modern Full Stack development principles are applied! 🚀
