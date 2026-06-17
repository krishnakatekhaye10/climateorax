# Climatora — Security Audit Report (Draft)

Scope
- Review of frontend code and dependency health for `carbon` repository.

Findings
- Sensitive data: API keys are read from `import.meta.env.VITE_GEMINI_API_KEY` (no key committed). Ensure CI/hosting secrets are configured in environment variables.
- Local storage: app uses localStorage extensively. Added `sanitizeForStorage` to escape HTML for stored strings; consider storing minimal sensitive info and using secure HTTP-only cookies for auth tokens.
- Runtime errors: Added `ErrorBoundary` to prevent whole-app crashes and provide safe fallback. Consider telemetry for error reporting (Sentry, Datadog).
- Dependencies: Ran `npm audit` and applied forced upgrades on `chore/audit-upgrades`. Remaining vulnerabilities require deeper review (notably transitive `dompurify` via `jspdf`).
  - `jspdf` upgrades applied; review any PDF export features for new behavior and input sanitization to avoid PDF injection vectors.
- Input sanitization: Implemented simple HTML escaping in `src/utils/sanitize.js` and integrated into the login form and AI coach input. For richer HTML inputs, adopt `DOMPurify` (pinned to secure version) or server-side sanitization.

Recommendations
- Secrets: Move secrets to provider (Vercel/Netlify) environment and never log them. Add a check to fail CI if `VITE_GEMINI_API_KEY` is present in repository files.
- LocalStorage: Avoid storing JWTs or long-lived tokens. Encrypt sensitive values if stored client-side, or use server-managed sessions.
- Dependency Management: Review the `chore/audit-upgrades` branch changes and test PDF flows thoroughly; consider replacing `jspdf` if risks persist.
- XSS: Audit all locations where user content is rendered. Use `escapeHtml` by default and adopt a vetted sanitizer for any HTML rendering.
- CI Security: Add `npm audit --audit-level=high` as a gating step in CI to block merges when critical vulnerabilities are present.

Action Items
- Add secret scanning in CI and pre-commit hooks.
- Validate PDF/reporting features for injection after `jspdf` upgrade.
- Replace or pin `dompurify` if project needs HTML sanitization.

