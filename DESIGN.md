# SkillBridge Design System

## Tech Stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4, Vanilla CSS Design Tokens
- Icons: Lucide React

## Theme & Visual Style

- Mode: Pure Dark Theme (color-scheme: dark)
- Typography:
  - Sans: Inter, -apple-system, sans-serif
  - Mono / Code: JetBrains Mono, monospace

## Color Tokens & Palette

- Background / Canvas: `#0B0C0E`
- Surface: `#121315`
- Surface Container (Card): `#14171D` (Hover: `#171A21`)
- Text Primary: `#F0F2F5`
- Text Secondary: `#9BA1B0`
- Text Tertiary: `#5D6474`
- Borders: `rgba(255, 255, 255, 0.08)` (Subtle: `0.04`, Focus: `#5E6AD2`)

### Semantic Colors

- Primary (Indigo): `#BDC2FF` / Container: `#5E6AD2`
- Secondary / Success (Escrow Emerald): `#48DFA3` / `#27C98F`
- Pending / Warning (Amber): `#FFB955` / `#F5A623`
- Error / Dispute (Rose): `#FFB4AB` / `#FF5C5C`

## Layout & Components Rules

- Cards: Radius 8px/12px, hairline borders, subtle hover transitions.
- Zero-token in browser: Toàn bộ form/action client gọi qua Route Handler `/api/*`.
