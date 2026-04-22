# AI Tax Advisor

AI-powered web application that provides intelligent, personalized tax guidance through a modern full-stack architecture and integrated AI services.

The app collects basic tax information (income, expenses, filing status,
dependents) via a responsive UI.

## Tech Stack

**Frontend**
- React 19 + TypeScript — UI + static types
- Vite — build tool & dev server
- React Router v7 — SPA routing
- React Hook Form + Zod — forms & validation
- CSS Modules — scoped styles, dark mode, responsive

**Tooling & Infrastructure**
- `npm` (frontend) · `uv` (backend) — fast, modern package managers

---

## Repository Structure

```
ai_tax_advisor/
├── frontend/                  # React + Vite + TypeScript client
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/        # Header, Footer, Layout wrapper
│   │   ├── features/          # Feature-based modules
│   │   │   ├── home/          # Home page
│   │   │   └── tax-form/      # Tax input form + schema + summary
│   │   ├── lib/               # Utility helpers (formatters)
│   │   ├── routes/            # Router + NotFound page
│   │   ├── styles/            # Global CSS vars, reset, utilities
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts         # Includes '@/*' path alias
│   └── package.json
├── backend/                   # FastAPI application (scaffold)
│   ├── main.py
│   └── pyproject.toml
├── local_data/                # Gitignored scratch space
├── .gitignore
└── README.md                  # ← you are here
```

**Path alias:** `@/...` resolves to `frontend/src/...` (configured in both
`vite.config.ts` and `tsconfig.app.json`).

---

## Prerequisites

- **Node.js ≥ 20** (tested with v24) — recommended via [`nvm`](https://github.com/nvm-sh/nvm)
- **npm ≥ 10** (bundled with Node.js)
- **Python ≥ 3.13** — recommended via [`pyenv`](https://github.com/pyenv/pyenv)
- **`uv`** — `curl -LsSf https://astral.sh/uv/install.sh | sh` *(planned for Step 2)*

Verify your setup:

```bash
node --version
npm --version
python3 --version
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Available Scripts

### Frontend (`cd frontend`)

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Dev server with hot-module reloading                       |
| `npm run build`   | Type-check (`tsc -b`) + optimized production build (Vite)  |
| `npm run preview` | Preview the production build locally                       |
| `npm run lint`    | Run ESLint across the codebase                             |

---

## What's Implemented

### Features

- **Responsive layout** with sticky header, primary navigation, and footer with disclaimer
- **Home page** with hero, CTAs, and a features grid
- **Tax input form** with 6 fields: full name, filing status, annual income, deductible expenses, dependents, and optional notes
- **Client-side validation** with a shared Zod schema (errors inline with ARIA attributes)
- **Submission preview** rendering the entered data and an estimated taxable base
- **404 Not Found** page for unknown routes

### Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Associated `<label>`, hint, and error messages for every input
- `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-live="polite"` where appropriate
- Visible focus rings
- Automatic dark mode via `prefers-color-scheme`

### Responsive Design

- Mobile-first layout with breakpoints at 480 / 640 / 1024 px
- Fluid typography using CSS `clamp()`
- Two-column form grid that collapses to a single column on narrow viewports

---

## License

This project is currently for educational/demonstration purposes.

> **Disclaimer:** AI Tax Advisor is a demonstration project and is not a
> substitute for professional tax advice. Always consult a certified
> accountant or tax professional for financial decisions.
