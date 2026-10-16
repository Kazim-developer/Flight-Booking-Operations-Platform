# Flight Booking & Operations Platform

A full-stack flight booking and airline operations application built
with **Next.js, NestJS, Prisma, and PostgreSQL**. It supports airline
administration, staff-assisted passenger bookings, and self-service
bookings for travelers.

> **Project status:** Core flight management and booking flows have been
> implemented. Verify the checklist below before considering the project
> production-ready.

## Features

### Travelers

- Search scheduled flights by origin, destination, and departure date.
- View flight prices and remaining seat availability.
- Book seats on an available flight.
- View personal booking history and booking references.
- Use profile details to populate passenger information.

### Airline administrators

- Create flights for their airline.
- Manage flight details including flight number, route,
  departure/arrival times, price, total seats, and available seats.
- Access airline-scoped operations.

### Airline staff

- View available flights for their airline.
- Create bookings on behalf of passengers.
- View bookings for their airline.

### Booking and seat management

- Each booking has a unique booking reference, passenger details, seat
  count, total price, and status.
- Seat availability is decremented within a database transaction.
- Conditional seat updates help prevent overbooking during concurrent
  requests.
- Traveler-created and staff-created bookings share the booking model,
  with optional traveler/staff relationships as appropriate.

### Authentication and authorization

- JWT-based authentication using an HTTP-only `access_token` cookie.
- Separate traveler, airline administrator, and airline staff user
  types.
- Protected routes enforce user-type and airline-scope checks where
  configured.

## Technology stack

Layer Technologies

---

Frontend Next.js, React, TypeScript, Tailwind CSS
Data fetching TanStack Query
Client state Zustand
Backend NestJS, TypeScript
Database PostgreSQL
ORM and migrations Prisma 7
Validation `class-validator`, `class-transformer`
Local environment Docker Compose

## Architecture

```text
Browser
  |
  v
Next.js frontend (port 3000)
  |
  | HTTP requests with credentials for cookie authentication
  v
NestJS API (port 3001)
  |
  v
Prisma
  |
  v
PostgreSQL
```

The frontend calls the backend API. NestJS handles authentication,
authorization, validation, business logic, and database operations
through Prisma.

## Main application areas

- **Traveler:** flight search, booking creation, and personal
  bookings.
- **Airline dashboard:** flight management for airline administrators.
- **Staff dashboard:** available flights and passenger booking
  operations.

## API routes

These routes are implemented in the current project scope.
Authentication and role restrictions apply where configured.

---

Method Route Purpose

---

`POST` `/flights` Create a flight as an
airline administrator

`GET` `/flights/available` List available flights
for the airline staff
workflow

`GET` `/traveler/flights` Search scheduled
flights

`POST` `/traveler/bookings` Create a booking for
the authenticated
traveler

`GET` `/traveler/bookings` List the authenticated
traveler's bookings

`POST` `/airline/staff/bookings` Create a passenger
booking as airline
staff

`GET` `/airline/staff/bookings` List bookings for the
staff workflow

---

If a global API prefix is configured in the backend, include that prefix
in requests.

## Run locally with Docker Compose

### Prerequisites

- Docker Engine
- Docker Compose plugin

### Start services

From the project root:

```bash
docker compose up -d --build
```

Check service status:

```bash
docker compose ps
```

Follow backend logs:

```bash
docker compose logs -f backend
```

Follow frontend logs:

```bash
docker compose logs -f frontend
```

Stop services without deleting persistent database volumes:

```bash
docker compose down
```

> Avoid `docker compose down -v` unless you intentionally want to delete
> Compose-managed volumes, which may contain local database data.

## Prisma and database migrations

Run Prisma commands inside the backend container so Docker service
hostnames resolve correctly.

Apply development migrations:

```bash
docker compose exec backend npx prisma migrate dev --config prisma7.config.ts
```

Generate Prisma Client:

```bash
docker compose exec backend npx prisma generate --config prisma7.config.ts
```

If the backend container is not running:

```bash
docker compose run --rm backend npx prisma generate --config prisma7.config.ts
```

Apply migrations only after confirming the intended schema changes. Do
not reset the database just to resolve a migration issue.

## Environment configuration

Configure the environment variables required by the frontend and backend
in your local environment files. Do not commit real credentials.

Frontend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

The backend needs a PostgreSQL connection string and the authentication
settings used by the application. Use the variable names already defined
in your backend configuration and Compose file. Inside Docker Compose,
the database host is typically the PostgreSQL service name; from the
host machine, that hostname may not resolve.

Placeholder example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@DATABASE_HOST:5432/DATABASE_NAME"
```

Replace placeholders with local values. Never publish production
secrets, JWT secrets, or real database credentials.

## Data model overview

- **TRAVELER** --- traveler identity and contact information.
- **AIRLINE** --- airline identity and airline code.
- **AIRLINE_USER** --- airline administrator account.
- **AIRLINE_STAFF** --- airline staff account.
- **Flight** --- schedule, route, price, status, and seat inventory.
- **Booking** --- booking reference, passenger details, seat count,
  total price, status, and related flight, airline, traveler, or staff
  member.

A booking can be made by a traveler or created by staff. The staff
relationship is optional for traveler bookings.

## Important implementation details

- Flight search returns scheduled flights departing in the future with
  available seats.
- Booking creation checks flight status, departure time, and available
  seats.
- Seat inventory is updated conditionally within a database
  transaction.
- Total price is calculated as flight price multiplied by requested
  seat count.
- Keep backend DTO validation enabled to reject invalid request
  bodies.
- Frontend requests that rely on cookie authentication must include
  credentials.

## Verification checklist

- [ ] Traveler signup, login, logout, and protected routes.
- [ ] Airline administrator authentication and airline-scoped flight
      creation.
- [ ] Staff authentication and staff-only booking operations.
- [ ] Traveler flight search with and without filters.
- [ ] Successful traveler booking appears in booking history.
- [ ] Staff-created booking appears in the staff booking list.
- [ ] Booking is rejected when seats are insufficient or a flight is
      no longer bookable.
- [ ] Seat availability remains correct after booking.
- [ ] Validation and authorization errors are handled clearly.
- [ ] Docker services start reliably and database data persists across
      restarts.

## Scope and future improvements

This project focuses on flight search, airline operations, and booking
workflows. Before real commercial use, additional work may be needed for
payment integration, cancellation policies, notifications, audit
logging, observability, automated tests, rate limiting, and production
deployment hardening.

## License

Add a license file before distributing this project publicly. Until a
license is specified, do not assume that others have permission to reuse
the code.
