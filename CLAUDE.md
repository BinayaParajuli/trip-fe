# CLAUDE.md

This file orients Claude Code when working in this repo. It is a **template** for Next.js apps — when you clone it, customize the parts marked _PROJECT_.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Tailwind v4** + **shadcn/ui** (style: `new-york`, baseColor: `neutral`, icons: `lucide-react`)
- **next-auth v4** (Credentials provider, JWT strategy)
- **axios** for HTTP
- **react-hook-form** + **zod** (with `@hookform/resolvers/zod`)
- **sonner** for toasts
- **PostHog** for analytics
- **PWA** via `@ducanh2912/next-pwa`

Path alias: `@/*` → `./src/*`.

## Architecture

This template enforces a **layered domain architecture**. Do not bypass layers. The flow for any API-driven feature is always:

```
component → domain/services → domain/apiRepository → axios instance
                ↑
        domain/mappers (snake_case API → camelCase frontend)
        domain/interfaces (IXxxApi + IXxx)
        domain/schema (zod form schemas)
```

### `src/` layout

```
src/
├── middleware.ts                  # next-auth route protection (edit matcher per project)
├── app/
│   ├── layout.tsx                 # Root: AuthProvider + Toaster + Suspense
│   ├── providers.tsx              # PostHog provider (opt-in, wrap where needed)
│   ├── globals.css                # Tailwind + shadcn tokens
│   ├── (auth)/                    # Route group: login, register (no header)
│   ├── (public)/                  # Route group: public pages with <Header/> layout
│   └── api/auth/[...nextauth]/    # NextAuth handler
├── components/
│   ├── ui/                        # shadcn primitives — DO NOT hand-edit; add via `npx shadcn add`
│   └── custom/                    # App components (Login, Register, Header, AuthProvider, MyPagination, ...)
├── domain/
│   ├── apiRepository/             # Axios calls only — no mapping, no business logic
│   ├── services/                  # Calls repository, runs mapper, applies business logic
│   ├── mappers/                   # Pure functions: IXxxApi → IXxx
│   ├── interfaces/                # Both IXxxApi (snake_case) and IXxx (camelCase) + IResponseApi<T>
│   └── schema/                    # Zod form schemas → exports XxxSchema + TXxxSchema type
└── lib/
    ├── utils.ts                   # `cn()` helper (clsx + tailwind-merge)
    ├── axios/
    │   ├── axiosInstance.ts       # Authenticated — auto-injects `Authorization: Token <session.accessToken>`
    │   └── authAxiosInstance.ts   # Unauthenticated — use for login/register only
    └── hooks/useApi.ts            # useFetch, useCreate, useUpdate, useDelete, useResponsePost
```

## Conventions

### Naming
- API-shape interfaces: `IXxxApi` with `snake_case` fields (matches backend exactly).
- Frontend interfaces: `IXxx` with `camelCase` fields.
- Mappers: `mapXxx(api: IXxxApi): IXxx` — pure, one per entity in `domain/mappers/`.
- Repositories: `export const xxxApiRepository = { ... }`.
- Services: `export const xxxService = { ... }` (auth file uses `authServices` — keep consistent with rest in new projects).
- Zod schemas: `export const XxxSchema = z.object({ ... })` plus `export type TXxxSchema = z.infer<typeof XxxSchema>`.

### API layer
- **Authenticated calls** → import `instance` from `@/lib/axios/axiosInstance`. Token is auto-attached from the next-auth session.
- **Unauthenticated calls** (login/register/public) → import `authInstance` from `@/lib/axios/authAxiosInstance`.
- `Content-Type` is stripped automatically when payload is `FormData` — pass `FormData` for file uploads.
- Base URL comes from `NEXT_PUBLIC_BASEURL`.
- Backend is **Django REST** style: token header is `Authorization: Token <token>` (NOT `Bearer`). If switching backends, update the interceptor in `axiosInstance.ts`.

### Paginated responses
Use the generic `IResponseApi<T>` from `domain/interfaces/apiResponse.ts`:
```ts
{ count, current_page, page_size, total_pages, results: T }
```
Service maps `results` with `.map(mapXxx)` and returns `{ ...apiResponse, results: mapped }`.

### Forms
- `react-hook-form` + `zodResolver(Schema)`.
- Schema lives in `domain/schema/`. Always export both the schema and the inferred `TXxxSchema` type.
- Submit handlers call `service.method(data)` directly — no extra wrapper.
- Errors surface via `sonner` toasts; field errors render inline as `<p className="text-red-500">`.

### Auth (next-auth)
- Provider: Credentials only. Auth flow: form → `signIn("credentials", ...)` → `authServices.login` → backend → JWT.
- Session shape augmented in `next-auth.d.ts` — **update this file when adding new session fields**.
- Roles: derived from backend `is_staff` boolean → `"owner" | "customer"`. Rename per project domain.
- `middleware.ts` redirects unauthenticated users to `/login?callbackUrl=<pathname+search>`.
- **Always update `middleware.ts` matcher** — the template ships with `["/path/:path*"]` which matches nothing useful.

### Route groups
- `(auth)` — no chrome, full-screen forms.
- `(public)` — wraps children with `<Header/>` and a container.
- Add `(dashboard)`, `(admin)`, etc. as new groups with their own `layout.tsx`. Groups don't affect the URL.

### Styling
- Use shadcn primitives from `@/components/ui`. Add new ones with `npx shadcn add <name>`.
- Compose classNames with `cn()` from `@/lib/utils`.
- Theme tokens are CSS variables in `globals.css` (`--primary`, `--background`, etc.) — change brand colors there, not in components.
- Dark mode: `.dark` class variant (already configured). Add `next-themes` provider if/when needed (dependency already present).

### Hooks
The handcrafted `useFetch` / `useCreate` / etc. in `lib/hooks/useApi.ts` are minimal. For anything beyond toy fetches, consider TanStack Query (not currently installed) — but stay consistent with whatever the project already uses.

## Adding a new feature (the playbook)

Given a new entity `Widget`, create in this order:

1. **`domain/interfaces/widgetInterface.ts`** — `IWidgetApi` (snake_case) + `IWidget` (camelCase).
2. **`domain/mappers/widgetMapper.ts`** — `mapWidget(api: IWidgetApi): IWidget`.
3. **`domain/apiRepository/widgetApiRepository.ts`** — raw axios calls, try/catch + `throw e`.
4. **`domain/services/widgetService.ts`** — calls repository, runs mapper, returns typed result.
5. **`domain/schema/WidgetSchema.ts`** (if there's a form) — zod schema + `TWidgetSchema`.
6. **`components/custom/Widget*.tsx`** — `"use client"` UI; call service from `onSubmit`/`useEffect`.
7. **`app/(group)/widgets/page.tsx`** — route, composes the custom component.

## Things that look wrong but aren't (template quirks)

- Many repositories/services have large commented-out CRUD blocks — they're stubs left as reference. Delete them once you implement the real ones for your project.
- `userMapper.ts` is empty; the mapping is done inline in `userService.meUser` instead. Either inline or extract — pick one per project.
- `middleware.ts` has commented role-routing logic — uncomment and adapt for multi-role apps.
- `next-auth.d.ts` lives at repo root, not under `src/`. Leave it there (Next.js picks it up via `tsconfig` include).

## Commands

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

## Per-project customization checklist

When you clone this template, do this first:

- [ ] Set `name` in `package.json`.
- [ ] Update `metadata` in `src/app/layout.tsx` (title, description, icons, manifest).
- [ ] Replace `FutsalHub` branding in `src/components/custom/Header.tsx`.
- [ ] Replace the role union (`"owner" | "customer"`) in `next-auth.d.ts` and `api/auth/[...nextauth]/route.ts`.
- [ ] Update `middleware.ts` matcher to the routes that actually need auth.
- [ ] Add `.env.local` with `NEXT_PUBLIC_BASEURL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and (optional) `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`.
- [ ] Delete or rewrite the sample futsal/booking/timeSlot domain files — they are template examples.
- [ ] Replace `public/icon-*`, `public/apple-icon.png`, `public/manifest.json` with project assets.
