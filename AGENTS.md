<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# ToolkitGO Enterprise Engineering & Agent Guidelines

All AI agents and contributors must uphold these rules across the ToolkitGO codebase.

## 1. Mandatory Context7 Tool Usage for Documentation Queries
- **Mandatory Policy**: Whenever querying or referencing library APIs, framework syntax, configuration patterns, breaking changes, or version updates for **Next.js**, **React**, **Tailwind CSS**, or **GSAP**, you **MUST query the Context7 MCP server** (`resolve-library-id` followed by `query-docs`).
- Do not rely solely on internal baseline knowledge for framework APIs without validating against current documentation via Context7.

## 2. Next.js 16 & React 19 Architectural Standards
- **App Router Architecture**: Keep page roots (`src/app/page.tsx`, `layout.tsx`) as Server Components for fast initial render and optimal SEO.
- **Client Boundary Minimization**: Apply `'use client'` strictly to interactive leaves and animated subcomponents (`src/components/sections/*`, `src/components/layout/*`, `src/components/forms/*`).
- **Strict TypeScript**: Never use `any`, `@ts-ignore`, or loose casting. Define explicit interfaces in `src/types/`.
- **Clean Code Documentation**: Maintain clear, informative comments and JSDoc annotations across all enterprise components.

## 3. Tailwind CSS v4 Design Token Governance
- **Single Source of Truth**: All design tokens are declared directly in `src/app/globals.css` within `@theme inline`.
- **Do Not Create Legacy Configs**: Do not generate `tailwind.config.js` or `tailwind.config.ts`.
- **ToolkitGO Brand Palette**:
  - `navy`: `#0F1940` (Primary trust color, dark sections, headers)
  - `orange`: `#F57C20` (ToolkitGO brand accent, CTAs, highlight badges)
  - `cream`: `#F8F6ED` (Warm neutral canvas background)
  - `charcoal`: `#34293B` (High-contrast WCAG AAA paragraph text)
  - `white`: `#FFFFFF` (Card surfaces and dark-section typography)
- **High-Contrast Accessibility**: Ensure a minimum 4.5:1 text contrast. On cream backgrounds, reserve brand orange for large typography (≥ 32px) and pill badges.

## 4. GSAP 3 Physics & Animation Governance
- **Always Register Plugins**: Ensure `gsap.registerPlugin(ScrollTrigger, useGSAP)` is executed once before use.
- **Scope All Selectors**: Always pass `{ scope: containerRef }` to `useGSAP()` to guarantee isolation and automatic teardown on unmount via `gsap.context().revert()`.
- **Event Handler Safety**: Wrap interactive event callbacks (e.g. mouse move, hover, click) in `contextSafe`.
- **Compositor Transforms Only**:
  - ✅ Permitted: `x`, `y`, `scale`, `rotation`, `opacity`, `autoAlpha`.
  - ❌ Forbidden: `width`, `height`, `top`, `left`, `margin`, `padding` (avoid layout thrashing).
- **Reduced-Motion Support**: Use `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` to disable heavy parallax and spring overshoots for motion-sensitive users.

## 5. Form & Data Integrity Standards
- **Dual-Tier Validation**: Validate inputs client-side for immediate user feedback and mirror validation server-side in API route handlers (`/api/register`).
- **Accessible Attributes**: Implement `aria-required`, `aria-invalid`, `aria-describedby`, and accessible dialog focus trapping on modals.
