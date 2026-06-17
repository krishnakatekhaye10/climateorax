# Climatora — Architecture Report (Draft)

Summary
- Repo: carbon
- Purpose: Interactive ClimateTech engagement platform
- Goals: Maintain existing features while improving code quality, security, and maintainability.

High-level architecture
- Frontend: React 19 + Vite (SPA) with feature-focused pages under `src/pages/`.
- UI: Tailwind CSS with component-level patterns in `src/components/`.
- State: LocalStorage-backed persistence via `src/hooks/useLocalStorage.js` for offline-first user data.
- AI: `src/services/geminiClient.js` — thin client with offline heuristic fallback when API key missing.
- Testing: Jest + Testing Library; automated tests under `src/tests/`.

Recent improvements
- Added `ErrorBoundary` at `src/components/ErrorBoundary.jsx` to catch runtime exceptions.
- Added input sanitization utilities at `src/utils/sanitize.js` and integrated into login and AI coach flows.
- Added CI workflow `.github/workflows/ci.yml` to run lint/test/build/audit on PRs and pushes.
- Created `FutureEarthSimulator` prototype (`src/pages/FutureEarthSimulator.jsx`) with a simple projection model and visualization using `recharts`.
- Performed dependency remediation on `chore/audit-upgrades` branch and validated tests/build locally.

Recommendations
- Continue moving toward a feature-based folder layout separating UI, hooks, services, and domain logic.
- Introduce a typed data model (TypeScript or JSDoc) for calculator and gamification payloads.
- Add API/service layer abstraction for future backend integrations (e.g., Firebase, Stripe).
- Implement a shared component library for buttons, cards, form controls to reduce duplication.

Next steps
- Formalize component library under `src/components/ui/` and migrate shared elements.
- Add route-based code splitting for large pages (Dashboard) via dynamic import.
- Create end-to-end smoke tests with Playwright for critical user flows.

