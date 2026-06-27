# CONSTRAINTS.md

## 1. System Architecture & Stack Map
- **Frontend Stack:** Node.js | Next.js 14 (App Router) | React 18 | TypeScript.
- **Frontend Package Manager:** `pnpm`.
- **Frontend Dependency File:** `package.json` / `package-lock.json` (npm registry lockfile kept for reproducibility, but `pnpm` is the installation tool).
- **Styling:** Tailwind CSS 3.4 (with PostCSS + Autoprefixer).
- **Maps:** Leaflet + react-leaflet.
- **PWA:** `next-pwa` (service worker + runtime caching, prod only).
- **Backend / API Layer:** Next.js Route Handlers (`src/app/api/*`) — server-side TypeScript, no separate backend service.
- **Database & Realtime:** Supabase (Postgres + Row Level Security + Realtime WebSocket channels).
- **External Services:** Groq API (`llama-3.3-70b-versatile` for fact-checking), USGS Earthquake GeoJSON feed, RSS sources (via `rss-parser`).
- **Hosting & Scheduling:** Vercel (hosting + Cron Jobs for `/api/ingest`).
- **Local Emulator:** Supabase CLI migrations under `supabase/`.

## 2. Strict Boundary Constraints
- **No npm / yarn:** Never execute `npm install` or `yarn install`. All dependency operations MUST use `pnpm` (e.g. `pnpm add <pkg>`, `pnpm add -D <pkg>`, `pnpm install`).
- **No pip:** This project has no Python service. Do not introduce Python tooling, virtualenvs, or `pip`/`uv` workflows.
- **No Global Packages:** Do not install global pnpm modules. Use existing dependencies declared in `package.json`.
- **No Global Agent Skills:** Do not install agent skills, extensions, or tool packages globally on the host system. Any project package, skill configuration, or custom command extension must be isolated locally within the `.pi` directory or the project workspace.
- **No Hardcoded URLs / Secrets:** External endpoints (`SUPABASE_URL`, `GROQ_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`) MUST come from environment variables. Never commit `.env.local`. The `CRON_SECRET` MUST be validated on `/api/ingest`.
- **No Push:** Execution of `git push` is strictly prohibited.
- **No Emojis in Output:** Never use emoji characters in script output, log messages, or commit messages unless explicitly requested by the user. Use plain text indicators instead (e.g. `[OK]`, `[FAIL]`, `[DONE]`).
- **PWA Disabled in Dev:** `next-pwa` MUST remain disabled when `NODE_ENV === 'development'`. Do not change the `disable` flag.
- **RLS-First Reads:** Public client reads from Supabase MUST rely on Row Level Security policies. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser; it is server-only.

## 3. Localization Rule (Mandatory)
- **Spanish-Only Visible Content:** All user-facing copy rendered in the web app (UI strings, labels, headings, button text, error messages, placeholders, alt text, tooltips, meta `description` / `og:title` / `og:description`, toast/notification text, RSS feed titles, and any string consumed by a browser component) MUST be written in Spanish.
- **Code comments and identifiers** may remain in English.
- **Approved exception:** Earthquake magnitude / depth numbers, timestamps in ISO-8601 (rendered via `Intl.DateTimeFormat('es-...')`), proper nouns of foreign sources (e.g. "Reuters", "AP News"), and the auto-approved USGS data block MAY keep their original technical form, but the surrounding descriptive text MUST be in Spanish.
- **Verification:** Any PR introducing or changing a visible string must keep that string in Spanish. Lint / review agents MUST flag any English string found in a `.tsx`, `.jsx`, or i18n / locale file under `src/app` or `src/components`.

## 4. Automation & Verification
- **Standard startup path:** `./init.sh` (to be implemented) must install deps with `pnpm`, run typecheck (`pnpm tsc --noEmit`) and build (`pnpm build`).
- **Standard verification path:** `pnpm install --frozen-lockfile` then `pnpm tsc --noEmit` then `pnpm build`. The build MUST succeed with zero TypeScript errors before a feature is marked complete.
- **PWA sanity check:** After build, `public/sw.js` (or workbox output) must exist and `public/manifest.webmanifest` must reference Spanish `name` and `short_name`.

## 5. Dependency Pinning & Locking
- **Pinned lockfile:** `package-lock.json` MUST be committed. Do not delete or regenerate it casually.
- **Add deps via pnpm only:** Always use `pnpm add <pkg>` (or `pnpm add -D <pkg>`). The change is reflected in `package.json` + `package-lock.json` automatically; do not hand-edit `package.json`'s dependency block.
- **No floating majors:** Major-version bumps (e.g. Next 14 -> 15, React 18 -> 19) require an explicit ADR-style note in `PROGRESS.md` and a green build before merge.
- **No unverified packages:** Do not add a dependency that is not on the npm registry or that has no recent maintenance. Prefer packages already in use.
- **Audit:** Run `pnpm audit --prod` before tagging a release; high/critical findings MUST be resolved or explicitly accepted in `PROGRESS.md`.
