# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BYOS Next (Build Your Own Server) is a self-hosted alternative to the TRMNL cloud. It's a Next.js 16 / React 19 app that registers TRMNL e-ink devices, computes which screen each device should show (via playlists), renders that screen to a 1-bit BMP, and serves it to the device firmware over HTTP polling. It also has a "recipes" gallery for prototyping e-ink screens in the browser before pushing them to hardware.

## Commands

```bash
pnpm dev              # generate:sql, generate:recipes, then next dev --turbopack
pnpm build            # prebuild (generate:sql, generate:recipes) then next build
pnpm lint             # biome check ./app ./components ./lib ./utils ./hooks
pnpm lint:fix         # biome check --write --unsafe (auto-fix)
pnpm format           # biome format --write
pnpm typecheck        # tsc --noEmit
pnpm generate:sql     # regenerate lib/database/sql-statements.ts from migrations/*.sql
pnpm generate:types   # regenerate lib/database/db.d.ts from a live Postgres via kysely-codegen
pnpm generate:recipes # regenerate lib/recipes/screens.generated.ts by scanning app/(app)/recipes/screens/
```

There is no test suite in this repo — don't invent test commands.

`generate:sql` runs before both `dev` and `build`; if you add/edit a file in `migrations/`, re-run it (or just `pnpm dev`) so `lib/database/sql-statements.ts` picks up the change — that generated file is what the in-app "Initialize" button executes, not the raw `.sql` files.

`generate:recipes` also runs before both `dev` and `build`; it scans `app/(app)/recipes/screens/` and writes the lazy-import map in `lib/recipes/screens.generated.ts` — re-run it (or `pnpm dev`) after adding a new recipe directory so it gets picked up.

Formatting uses **tabs** and **double quotes** (biome.json). Biome's `organizeImports` assist is on, so import order is auto-fixed — don't hand-tune it.

## Architecture

### Route groups (`app/`)

- `app/(app)/` — the authenticated dashboard: device management, playlists, recipes gallery, mixup, admin, system logs, tools. Has a shared `layout.tsx`.
- `app/(auth)/` — sign-in/sign-up/recover pages, only meaningful when `AUTH_ENABLED=true`.
- `app/(render)/` — a minimal, unstyled layout used purely for screenshotting recipes (`recipes/[slug]/preview`) with the Puppeteer/browser renderer. Keep this layout free of chrome/nav — anything added here shows up in the rendered BMP.
- `app/api/` — the device-facing HTTP API (see `docs/api.md`) plus proxy endpoints forwarded to the real TRMNL cloud API (`/api/categories`, `/api/ips`, `/api/models`, `/api/palettes`, `/api/markup`, `/api/plugin_settings/*`).

`proxy.ts` (used as Next.js middleware) gates every non-public path behind Better Auth's session check, and is a no-op when `auth` is null (`AUTH_ENABLED=false`).

### Device protocol

Devices authenticate via `ID` (MAC address) and `Access-Token` (API key) headers. `GET /api/setup` registers a new/reset device; `GET /api/display` returns the next screen URL + `refresh_rate` for the device's current playlist slot. Device telemetry (`Battery-Voltage`, `FW-Version`, `RSSI`) is recorded on each `/api/display` call. See `docs/api.md` for the full contract — treat it as the source of truth for header/response shapes when touching `app/api/`.

### Recipe rendering pipeline (`lib/recipes/`)

This is the core of the app and the part most likely to need changes.

1. A recipe is either a **React recipe** (a component module under `app/(app)/recipes/screens/<slug>/<slug>.tsx` exporting a `definition: RecipeDefinition`) or a **Liquid recipe** (stored in the DB, TRMNL-markup based, handled by `lib/recipes/liquid-renderer.ts`).
2. `lib/recipes/recipe-renderer.ts` is a thin orchestrator with two entry points, `renderRecipeToImage()` and `renderRecipeForDevice()`, both branching React vs Liquid internally. The actual work lives in `lib/recipes/registry.ts` (built-in React recipe lookup), `lib/recipes/runtime/react.ts` (params + data resolution), and `lib/recipes/render/rasterize.ts` (PNG pipeline).
3. React recipes are **auto-discovered**: `scripts/generate-recipes-index.mjs` scans `app/(app)/recipes/screens/` for `<slug>/<slug>.tsx` files and writes a lazy `import()` map to the committed, generated `lib/recipes/screens.generated.ts` (run via `pnpm generate:recipes`, part of `prebuild`/`dev`). A recipe module must export `definition` (a `RecipeDefinition`: `meta`, `paramsSchema`/`dataSchema` as Zod schemas, optional `getData`, and `Component`) — `lib/recipes/registry.ts` throws a clear error at load time if it's missing. **There is no manual registration file to edit** — adding a recipe is just adding the directory and regenerating the index.
4. Three renderer backends, selected by `REACT_RENDERER` env var (`lib/recipes/renderers/{takumi,satori,browser}.ts`):
   - `takumi` (default) — fast Rust-backed Satori-compatible renderer.
   - `satori` — original Vercel Satori renderer; only one that supports the custom `dither-*` Tailwind classes.
   - `browser` — headless Chrome via `puppeteer-core`, needed for pixel-perfect TRMNL Framework UI parity; requires `docker-compose.browser.yml` or a reachable `BROWSER_URL` Chrome DevTools endpoint (see `lib/recipes/chrome-pool.ts` / `html-screenshot.ts`).
5. PNG → 1-bit BMP conversion happens via `utils/render-bmp.ts` (Floyd-Steinberg dithering by default), producing the 800×480 1-bit BMP with TRMNL-specific header that devices expect.
6. `RecipeDefinition.paramsSchema` (Zod) drives the user-configurable params form (resolved per-device via `app/actions/screens-params.ts`); `dataSchema` describes what `Component` actually renders against (equal to `paramsSchema` for recipes with no fetch). `meta.renderSettings` supports `supersample` (2x render then downscale for sharper text — the old `doubleSizeForSharperText` name) and `imageDither`/`applyEdgeSnap`.

To add a new React recipe: create `app/(app)/recipes/screens/<slug>/{<slug>.tsx, getData.ts}` where `<slug>.tsx` exports `paramsSchema`, `dataSchema`, and `definition`, then run `pnpm generate:recipes` (or `pnpm dev`) to pick it up. See `docs/recipes.md` for the full schema and responsive/dither authoring notes.

### Database & multi-tenancy (`lib/database/`)

- `lib/database/db.ts` is a single Kysely + `pg` Pool instance, typed from `lib/database/db.d.ts` (regenerate with `pnpm generate:types` against a live DB — don't hand-edit).
- Postgres Row-Level Security enforces per-user data isolation. Application queries that need RLS must go through `lib/database/scoped-db.ts` (`withUserScope`, `withExplicitUserScope`, `withUserScopeTransaction`), which `SET ROLE byos_app` and sets the `app.current_user_id` session variable for the duration of the query, then resets both before releasing the pooled connection back — don't query `db` directly for user-owned data or RLS won't apply.
- Mono-user mode (`AUTH_ENABLED=false`) uses a fixed synthetic user id, `BYOS_MONO_USER_ID` in `lib/auth/get-user.ts`, which must match the seed in `migrations/0013_seed_mono_user.sql`.
- Migrations live in `migrations/*.sql`, applied in numeric order, either manually or via the in-app "Initialize" button (which runs the output of `pnpm generate:sql`, i.e. `lib/database/sql-statements.ts` — regenerate that file after adding a migration). Migration `0009_add_user_tenancy.sql` assumes a `postgres` superuser role; on managed providers, `GRANT byos_app TO <your_role>` first (see upstream issue #46).
- No-DB mode: running without `DATABASE_URL` still works for previewing recipes; device/playlist management is disabled (`lib/database/utils.ts#checkDbConnection` gates this).

### TRMNL registry proxy (`lib/trmnl/registry.ts`)

Local cache-through proxy for read-only TRMNL cloud data (models, palettes, categories, ips): serves from an in-memory cache, falls back to a bundled JSON snapshot under `data/trmnl/`, and best-effort persists refreshed data back to disk. 24h TTL. Set `TRMNL_PROXY_LIVE=true` to bypass caching entirely (debugging only). If you touch this, keep the fallback chain (fresh → memory cache → disk snapshot → error) intact — it's what keeps `/api/models` etc. working when the upstream TRMNL API is unreachable.

## Environment & renderers

Full variable list is in `.env.example`; see `README.md`'s "Variables d'environnement" table for the summary (`DATABASE_URL`, `AUTH_ENABLED`, `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL`, `ADMIN_EMAIL`, `REACT_RENDERER`, `ENABLE_EXTERNAL_CATALOG`). The `browser` renderer needs either the `docker-compose.browser.yml` overlay or a `BROWSER_URL` pointing at a Chrome DevTools endpoint.

## Notable non-obvious conventions

- Route-group folder names (`(app)`, `(auth)`, `(render)`) are load-bearing for layout scoping — don't flatten them.
- `next.config.ts` conditionally adds `puppeteer-core`/`puppeteer` to `serverExternalPackages` and file tracing only if those packages are actually installed — the browser renderer is optional at the infra level, don't assume it's always present.
- `cacheComponents: true` and `output: "standalone"` are set in `next.config.ts`; the custom `cache-handler.js` at the repo root is wired in for ISR/ImageResponse caching — check it before changing revalidation behavior on bitmap routes.
- The Dockerfile's final stage is based on `chromedp/headless-shell`, not a plain Node image, specifically to support the `browser` renderer in containerized deployments.
