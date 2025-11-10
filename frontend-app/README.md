# FakeStore Admin/User App

Single-page application built with Vue 3 (Composition API) + Vite to cover the requirements from `Frontend_Developer_Technical_Test.docx`. It integrates with the public [Fake Store API](https://fakestoreapi.com/docs) to demonstrate authentication, product & user CRUD for admins, and shopping/cart flows for regular users.

## Stack
- Vue 3 + TypeScript, Vue Router 4, Pinia
- Tailwind CSS for styling
- Axios for HTTP requests

## Features
- Authentication against `/auth/login` with local token/session persistence and optional role selection (Admin/User).
- User journey: browse/search products, view details, maintain a local cart, and perform a simulated checkout that also posts to `/carts`.
- Admin journey:
  - Products: list, create, edit, delete using `/products` endpoints.
  - Users: list, create, edit, delete using `/users` endpoints.
- Loading, error, and empty states on every key data grid plus reusable UI components (cards, inputs, buttons, state blocks).

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. Build for production (already tested via `npm run build`).

## Credentials
Use the credentials provided in the brief (pre-filled on the login screen):
```
username: johnd
password: m38rmF$
```
Select the desired role (Admin or User) before logging in to explore both journeys.

## Notes
- API requests are centralized in `src/api/fakeStore.ts` with Axios configuration in `src/api/client.ts`.
- Auth/session state lives in `src/stores/auth.ts`; cart management lives in `src/stores/cart.ts`.
- Routes and guards are defined in `src/router/index.ts` (admin routes require the admin role).
