# UI component setup

The project already uses Next.js App Router, TypeScript and Tailwind CSS v4.
Run `npm install` after pulling the changes to install Motion, Lucide and the
class-merging utilities used by the navbar.

- Reusable components: `src/components/ui/`
- Shared styles and brand tokens: `src/app/globals.css`
- Component aliases and shadcn configuration: `components.json`
- Class utilities: `src/lib/utils.ts`

`@/components/ui` resolves to `src/components/ui` because `@/*` maps to `src/*`.
Keep reusable UI here, rather than creating a second root-level `components/ui`
folder, so shadcn CLI additions and application imports resolve consistently.
The Tailwind config path is intentionally empty for v4; do not add a legacy
`tailwind.config.js` file.

## Navbar

`src/components/ui/navbar-1.tsx` contains the supplied component adapted to the
ToolkitGO logo, page anchors and solid brand colors. The layout's existing
`Navbar` export delegates to it. `src/components/ui/demo.tsx` shows standalone
usage. It requires no context provider or global state store.

The navbar uses a solid floating bar with visible desktop links from 1024px.
Below that width, a cream dropdown provides large navigation rows, the partner
action, and contact email. It supports animated opening and closing, Escape,
outside clicks, focus-leave dismissal, native anchor navigation, and reduced
motion. The header stays 80px tall so existing scroll offsets remain valid.
The dropdown is a non-modal disclosure and scrolls natively alongside Lenis.

## Social profiles

Add an `href` to each entry in `SOCIAL_PROFILES` in `src/lib/site.ts` when the
official account URLs are ready. Until then, the footer displays platform names
without sending visitors to guessed accounts. The contact email is configured
in the same file.
