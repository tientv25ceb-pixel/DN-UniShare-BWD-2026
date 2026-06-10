# ĐN Design System

## 1. Context & Goals

ĐN is a dark-themed, glow-accentuated content platform for readers and knowledge seekers. This document defines the token-driven UI system that enforces consistency, accessibility, and implementation speed across the entire content surface.

**Design intent:** A single-font, dark-only, fully-rounded interface where green accent (`--dn-border-strong`) provides visual hierarchy against near-black surfaces. The green from the original codebase is preserved as the system accent.

**Token philosophy:** All raw values (`lab()`, `px`, `oklch()`) exist only in token definitions. Components reference semantic CSS variables exclusively.

---

## 2. Design Tokens & Foundations

### 2.1 Font

```css
--dn-font-primary: 'Outfit', ui-sans-serif, system-ui, sans-serif;
--dn-font-weight-base: 350;
--dn-font-size-base: 16px;
--dn-line-height-base: 25.6px;
```

`Outfit` is the sole brand font. No secondary or fallback font families are permitted. All text — headings, body, labels, navigation — uses `--dn-font-primary`.

### 2.2 Typography Scale

```css
--dn-text-xs:   10.24px;
--dn-text-sm:   12.8px;
--dn-text-md:   16px;       /* base */
--dn-text-lg:   20px;
--dn-text-xl:   25px;
--dn-text-2xl:  31.25px;
--dn-text-3xl:  32px;
--dn-text-4xl:  39.06px;
```

| Token | Size | Used For |
|---|---|---|
| `--dn-text-xs` | 10.24px | Metadata, timestamps, badges, character counts |
| `--dn-text-sm` | 12.8px | Labels, helper text, caption, footnote links |
| `--dn-text-md` | 16px | Body copy, button labels, input text, card descriptions |
| `--dn-text-lg` | 20px | Section subheadings, card titles, nav items |
| `--dn-text-xl` | 25px | Section headings, modal titles |
| `--dn-text-2xl` | 31.25px | Page headings (h2) |
| `--dn-text-3xl` | 32px | Hero headings (h1), display text |
| `--dn-text-4xl` | 39.06px | Hero emphasis, large display |

### 2.3 Color Palette

```css
/* Semantic token      lab() / oklch() value                 */
--dn-text-primary:     lab(93.0632 0.459909 3.01538);       /* near-white    */
--dn-text-secondary:   lab(51.2902 0.521302 2.22192);       /* dim gray      */
--dn-border-strong:    oklch(0.62 0.2 145);                 /* preserved green */
--dn-text-inverse:     lab(35.0526 0.71311 2.97467);        /* near-black    */
--dn-surface-base:     #000000;                              /* pure black    */
--dn-surface-muted:    lab(9.45811 -1.93688 -8.61478);      /* subtle dark   */
--dn-surface-strong:   lab(5.20297 -0.7421 -7.06236);       /* elevated      */
```

**Usage rules:**
- `--dn-text-primary` on `--dn-surface-base` for all body text
- `--dn-text-secondary` for metadata, captions, placeholder text
- `--dn-border-strong` (green) for interactive borders, focus rings, accents, active indicators
- `--dn-text-inverse` for text on green/light backgrounds
- `--dn-surface-muted` for card backgrounds, input surfaces
- `--dn-surface-strong` for hovered cards, active dropdowns, modal surfaces

No light mode. This system is dark-only.

### 2.4 Spacing Scale

```css
--dn-space-1: 4px;
--dn-space-2: 8px;
--dn-space-3: 12px;
--dn-space-4: 16px;
--dn-space-5: 24px;
--dn-space-6: 29.28px;
--dn-space-7: 29.3px;
--dn-space-8: 40px;
```

### 2.5 Radius

```css
--dn-radius-xs: 999px;
```

All interactive and container elements use fully rounded corners. This includes cards, buttons, inputs, badges, modals, dropdowns, skeletons. No other radius token exists. No squared or intermediate radius is permitted.

### 2.6 Shadows

```css
--dn-shadow-1: oklch(0.62 0.2 145 / 0.18) 0px 0px 8.628px 0px,
               oklch(0.62 0.2 145 / 0.07) 0px 0px 17.256px 0px;
--dn-shadow-2: lab(0 0 0 / 0.04) 0px 2px 12px 0px;
```

| Token | Usage |
|---|---|
| `--dn-shadow-1` | Green glow on hovered/active cards, focus-visible rings, active states |
| `--dn-shadow-2` | Subtle elevation on default cards, dropdowns, modals |

### 2.7 Motion

```css
--dn-duration-instant: 120ms;
--dn-duration-fast: 220ms;
```

| Token | Usage |
|---|---|
| `--dn-duration-instant` | Color transitions, opacity fades, border changes |
| `--dn-duration-fast` | Hover lifts, scale transforms, dropdown open/close |

All motion must respect `prefers-reduced-motion: reduce` — replace with `--dn-duration-instant` and no transform.

---

## 3. Component-Level Rules

### 3.1 Cards (42 instances)

**Anatomy:** Thumbnail → Title → Metadata row → Action area

**Variants:**
- **Default card** (`item-card`): thumbnail, title (2-line max), author/date metadata, optional badge
- **Skeleton card** (`ItemCardSkeleton`): shimmer placeholder matching card dimensions
- **Tilt card** (`tilt-card`): 3D perspective wrapper on hover (GSAP), disabled when `prefers-reduced-motion`

**States:**

| State | Visual | Implementation |
|---|---|---|
| Default | `--dn-surface-muted` bg, `--dn-shadow-2`, `--dn-radius-xs` | `background: var(--dn-surface-muted)` |
| Hover | Elevate with `--dn-shadow-1` (green glow), slight translateY(-2px) | `transition: box-shadow var(--dn-duration-fast), transform var(--dn-duration-fast)` |
| Focus-visible | `outline: 2px solid var(--dn-border-strong)` with `outline-offset: 2px` + `--dn-shadow-1` | Must be programmatically focusable (tabindex or `<a>`) |
| Active | Scale down to 0.98, reduce glow intensity | `transform: scale(0.98)` |
| Disabled | Opacity 0.4, no pointer events, no hover effects | `pointer-events: none; opacity: 0.4` |
| Loading | Skeleton shimmer (`--dn-surface-strong` animated gradient) | Replace content with skeleton placeholder |
| Error | Fallback state: gray placeholder thumbnail + "Không thể tải" helper text | Show on image load failure or data fetch error |

**Responsive:**
- Mobile (< 640px): single column, full-width
- Tablet (640–1024px): 2-column grid
- Desktop (> 1024px): 3-column grid with `auto-fill`

**Edge cases:**
- Long titles: `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`
- Missing image: show default placeholder icon (Lucide `ImageOff`) on `--dn-surface-strong` background
- Empty state: centered illustration + "Chưa có bài đăng nào" heading + CTA button
- Zero metadata: hide metadata row entirely; don't show empty `<p>`

**Keyboard:** Cards that are links must be `<a>` elements; cards with actions must have `role="button"` + `tabindex="0"` + `onKeyDown` handling for `Enter`/`Space`.

---

### 3.2 Links (20 instances)

**Anatomy:** Text content, optional icon (Lucide), optional underline

**Variants:**
- **Inline link:** within body text, underline on hover, `--dn-border-strong` color
- **Navigation link:** header/footer items, uppercase, letter-spacing, active underline indicator
- **Card link:** entire card clickable (see 3.1)
- **Footer link:** marquee scroll link items, `--dn-text-secondary` default, `--dn-text-primary` hover

**States:**

| State | Inline Link | Nav Link |
|---|---|---|
| Default | `--dn-text-primary`, no underline | `--dn-text-secondary`, uppercase |
| Hover | Underline, `--dn-border-strong` color | `--dn-text-primary`, bar indicator |
| Visited | `color-mix` with `--dn-text-secondary` | Same as default |
| Focus-visible | `outline: 2px solid var(--dn-border-strong)` + `outline-offset: 2px` | Same |
| Active | `--dn-border-strong` color, no underline | Scale down, brighten |
| Disabled | `--dn-text-secondary`, no pointer events | Opacity 0.4 |

**Touch:** Minimum touch target 44×44px. If link text is shorter, add `padding: 12px` via `--dn-space-3`.

**Edge cases:**
- Long URLs within inline text: truncate with ellipsis via `text-overflow: ellipsis; overflow: hidden; white-space: nowrap`
- Adjacent links: minimum 8px (`--dn-space-2`) gap between interactive regions
- Links opening external sites: add `target="_blank" rel="noopener noreferrer"` with `aria-label` including "Mở trong tab mới"

---

### 3.3 Buttons (5 instances)

**Anatomy:** Container (`--dn-radius-xs`), optional leading icon (Lucide, 16×16px), label (`--dn-text-md`), optional loading spinner

**Variants:**
- **Primary:** `--dn-border-strong` as full background, `--dn-text-inverse` text
- **Outline:** transparent bg, `1px solid var(--dn-border-strong)` border, `--dn-text-primary` text
- **Ghost:** no border, `--dn-text-primary` text, hover with `--dn-surface-muted` bg
- **Icon-only:** square, same dimensions as height, Lucide icon, `aria-label` required

**States:**

| State | Primary | Outline | Ghost | Icon-only |
|---|---|---|---|---|
| Default | `background: var(--dn-border-strong)` | `border: 1px solid var(--dn-border-strong)` | `background: transparent` | Same as ghost |
| Hover | Brighten via `filter: brightness(1.1)` | `background: var(--dn-border-strong)` | `background: var(--dn-surface-muted)` | Same |
| Focus-visible | `outline: 2px solid var(--dn-border-strong)` offset 2px | Same | Same | Same |
| Active | `transform: scale(0.97)` | Same | Same | Same |
| Disabled | `opacity: 0.4; pointer-events: none; filter: none` | Same | Same | Same |
| Loading | Show spinner, hide label, reduce width | Same | Same | Same |
| Error | Shake animation (translateX ±4px × 3 cycles), show error message below | Same | Same | Same |

**Touch:** Minimum 44×44px touch target on all buttons. Icon-only must be exactly 44×44px minimum.

**Keyboard:** `Enter` or `Space` activates. Button must be `<button>` element (not `<div>`).

**Edge cases:**
- Label overflow: never wrap; use `white-space: nowrap` and truncate with `text-overflow: ellipsis` at max button width
- Multiple buttons side-by-side: 12px (`--dn-space-3`) gap minimum
- Full-width button on mobile: `width: 100%` below 640px
- Loading state must preserve the button's width to prevent layout shift

---

### 3.4 Navigation (3 instances)

#### Header
- Fixed position, `z-index` above page content
- Backdrop blur on scroll: `backdrop-filter: blur(12px)` with `--dn-surface-base / 0.8` bg
- Scroll-aware: hide on scroll down (translateY(-100%)), show on scroll up
- Contains: logo, nav links (home, about, browse), post dropdown, profile/login area

#### Post Dropdown
- `AnimatePresence` mount/unmount with fade + slight translateY
- Click-outside-close via ref-based detection
- Escape key closes
- Focus trap: first item focused on open, last item wraps to first
- Items: Give, Exchange, Sell, Lost, Found — each with Lucide icon

#### Footer
- Marquee scroll style (preserve Ft8 archetype)
- Pause on hover/focus: `animation-play-state: paused`
- Links: About, Contact, Privacy, Terms
- Copyright line with `--dn-text-secondary`

**States:** All nav links follow link state rules (3.2). Active route indicator: `--dn-border-strong` underline on header links.

**Edge cases:**
- Mobile nav: collapse to hamburger menu, full-screen overlay, vertical list
- Long nav labels: keep short (1–2 words); truncate at overflow
- Post dropdown with many types: max 6 items before scroll; `max-height: 60vh; overflow-y: auto`

---

### 3.5 Form Inputs

**Anatomy:** Label (`--dn-text-sm`, `--dn-text-secondary`) → Input field (`--dn-text-md`, `--dn-radius-xs`, `--dn-space-4` padding) → Helper text (`--dn-text-xs`, `--dn-text-secondary`) → Error message (`--dn-text-xs`, `--dn-border-strong` color)

**Variants:**
- **Text input:** single line
- **Textarea:** multi-line, resizable vertical only, `min-height: 100px`
- **Select:** dropdown with native `<select>` or custom with chevron icon

**States:**

| State | Visual |
|---|---|
| Default | `border: 1px solid transparent`, `background: var(--dn-surface-muted)` |
| Hover | `border-color: var(--dn-border-strong)` at 50% opacity |
| Focus-visible | `border-color: var(--dn-border-strong)`, `outline: 2px solid var(--dn-border-strong)` offset 2px, `--dn-shadow-1` |
| Active | Same as focus |
| Disabled | `opacity: 0.4; pointer-events: none` |
| Error | `border-color: var(--dn-border-strong)` (green acts as error), error message below |
| Loading | Right-aligned 16px spinner within input, debounce delay before validation |

**Touch:** iOS zoom prevention: `font-size: 16px` minimum on inputs.

**Edge cases:**
- Character count: show counter below as `{current}/{max}` when `maxLength` set
- Autofill: use `transition: background-color var(--dn-duration-instant)` to prevent sticky autofill styles
- Empty required fields on submit: show error state on all invalid fields simultaneously
- Long placeholder text: truncate with ellipsis

---

### 3.6 Modals

**Anatomy:** Overlay (`--dn-surface-base / 0.6`) → Dialog container (`--dn-surface-strong`, `--dn-radius-xs`, `--dn-shadow-2`) → Close button (icon-only) → Content area → Optional action footer

**Variants:**
- **Login modal:** Google OAuth button, centered, compact
- **QR modal:** QR code image, download button, centered
- **Payment modal:** 4-step wizard with progress indicator, form steps, confirmation

**States:**

| State | Rule |
|---|---|
| Open | `AnimatePresence` fade in overlay + scale up dialog from 0.95 → 1 |
| Close | Fade out overlay + scale down dialog, `onExitComplete` cleanup |
| Escape | Closes modal, returns focus to trigger element |
| Backdrop click | Closes modal (except payment modal mid-transaction) |
| Focus trap | Tab cycles through interactive elements; Shift+Tab reverse; first/last element wrap |

**Keyboard:** Focus must move into modal on open. Closing returns focus to trigger. Prevent body scroll: `overflow: hidden` on `<body>`.

**Edge cases:**
- Multiple modals: only one at a time; queue or replace
- Long content: dialog scrollable (`max-height: 85vh; overflow-y: auto`)
- Small viewport: dialog uses `--dn-space-4` margin on all sides, full-width below 480px
- Mid-transaction close (payment modal): confirmation dialog "Bạn có chắc muốn hủy?"

---

### 3.7 Specialized Components

#### 3.7.1 3D Globe (`globe-section.tsx`)
- Imperative Three.js mounted in `useEffect`
- Full earth with atmosphere glow, rotating stars, territorial markers
- Camera anchored orbiting Vietnam
- Degradation: reduce polygon count and disable glow when `prefers-reduced-motion` or low-performance
- Loading: full-screen spinner with "Đang tải bản đồ 3D..."
- Error: dark fallback section with "Không thể tải bản đồ" message and retry button
- Mobile (< 768px): disable globe, show static hero section instead
- Touch: one-finger rotate on globe, pinch zoom

#### 3.7.2 VietMap Selector (`vietmap-selector.tsx`)
- VietMap GL JS integration with Nominatim/OpenStreetMap address search
- GPS auto-location with permission request
- Predefined hotspot markers for university area
- States: loading (map tiles loading), empty (no search results), error (map failed to load, geolocation denied)
- Keyboard: Arrow keys pan map, Enter confirms selection, Escape closes search results
- Touch: pinch-to-zoom, drag-to-pan, tap to place marker
- Focus-visible ring on search input, confirm button, and hotspot markers

#### 3.7.3 Payment Modal (`payment-modal.tsx`)
- 4-step wizard: (1) method select, (2) QR display, (3) card input, (4) confirmation
- Progress indicator: 4 dots at top, filled dot for completed, green dot for current
- Back button at each step preserves entered data in Zustand store
- 3D card flip animation on card input (`rotateY(180deg)` on flip)
- States per step: loading (QR generation, payment processing), error (payment failed, invalid card), success (confirmation screen with checkmark)
- Keyboard: Enter advances step, Escape exits (with confirmation in step 2/3), Tab through card fields
- Touch: card flip responds to swipe gesture
- Edge: browser back button should not break wizard state; store state in Zustand

#### 3.7.4 Decorative Elements
- **Decorative grid, floating shapes, wave background:** purely visual, no interaction
- **Dragon bridge, mountain range:** SVG/Canvas ambient art, loaded after LCP
- **Gift animation, impact globe:** simple CSS/animations for visual delight
- All must respect `prefers-reduced-motion: reduce` (replace with static state)
- All must have `aria-hidden="true"` and not block pointer events
- Responsive: hide or simplify below 768px to reduce rendering cost

---

## 4. Accessibility Requirements

### WCAG 2.2 AA — Testable Acceptance Criteria

| Criteria | Pass | Fail |
|---|---|---|
| Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (18px+ bold or 24px+ regular) between `--dn-text-primary` and `--dn-surface-base` | Contrast ratio verified with lab values | Ratio below threshold |
| Every interactive element has a visible focus-visible indicator (`outline: 2px solid var(--dn-border-strong)` + offset 2px) | Indicator visible on tab navigation | No indicator or clipped by overflow |
| All touch targets ≥ 44×44px | Measured via computed style in DevTools | Target smaller than 44px in either dimension |
| Keyboard reachable: all interactive elements reachable via Tab in logical order | Tab through entire page reveals all actions | Some elements unreachable |
| Keyboard operable: all actions triggerable via Enter/Space | Tested with keyboard-only navigation | Action requires pointer |
| `prefers-reduced-motion: reduce` disables all non-essential animation | No translate, scale, rotate, or opacity animation on reduced motion | Animation still plays |
| Screen reader: all images have meaningful alt text; icon-only buttons have `aria-label` | NVDA/VoiceOver reads correct labels | Missing or generic labels |
| Focus order matches visual reading order | Tab order equivalent to DOM visual order | Tab jumps out of sequence |
| Error messages are programmatically associated with inputs via `aria-describedby` | Screen reader announces error on focus | Error not associated |
| Modal open: focus trapped; close returns focus to trigger | Tab cycles inside; Escape returns focus | Focus leaves modal or not restored |

---

## 5. Content & Tone Standards

### Voice
Concise, confident, implementation-focused. Vietnamese-first UI. English only for technical/admin contexts.

### Examples

| Component | Good | Bad |
|---|---|---|
| Button label | "Đăng bài" | "Bấm vào đây để đăng bài" |
| Link text | "Xem chi tiết" | "Xem" (ambiguous) |
| Empty state | "Chưa có bài đăng nào" | "Không có gì ở đây cả" |
| Error message | "Không thể tải bài viết. Thử lại." | "Đã xảy ra lỗi" |
| Card title | "Sách giáo trình Kinh tế vĩ mô" | "Món đồ rẻ đẹp" |
| Helper text | "Tối đa 500 ký tự" | "Vui lòng nhập ít hơn 500 ký tự" |

### Character Limits

| Field | Max | Truncation |
|---|---|---|
| Card title | 80 chars | 2-line clamp |
| Description | 500 chars | Show full, collapse after 3 lines with "Xem thêm" |
| User name | 50 chars | Ellipsis at overflow |
| Message body | 2000 chars | Show full within scrollable container |

---

## 6. Anti-Patterns & Prohibited Implementations

| Prohibited | Why | Instead |
|---|---|---|
| Inline hex/rgb/lab values in components | Breaks token system, creates drift | Use `var(--dn-*)` |
| `outline: none` on focus without replacement | WCAG 2.2 AA failure | Use `--dn-border-strong` focus ring |
| Mixed border radius values | Inconsistent with fully rounded aesthetic | Only `--dn-radius-xs: 999px` |
| One-off spacing values (`margin: 6px`, `padding: 18px`) | Sporadic layout, hard to maintain | Use `--dn-space-*` scale |
| Light mode variants | Dark-only system; light mode dilutes brand identity | Keep dark-only |
| "Click here", "Xem tại đây" link labels | Non-descriptive, poor screen reader experience | Describe the destination |
| Cards without hover glow | Misses brand moment; feels flat | Apply `--dn-shadow-1` on hover |
| Hidden scroll on modals without `overflow: hidden` on body | Double scroll bars, poor UX | Toggle `overflow: hidden` on `<body>` |
| Loading spinners without width preservation | Layout shift on button/content | Fixed width during loading |
| Non-descriptive `alt` attributes (e.g. `alt="image"`) | Poor screen reader experience | Describe content: `alt="Sách giáo trình Kinh tế vĩ mô"` |
| `prefers-reduced-motion` animations that still move | User request violated | No movement; instant opacity changes only |

---

## 7. QA Checklist

- [ ] All surfaces use `--dn-surface-base`, `--dn-surface-muted`, or `--dn-surface-strong` — no raw blacks
- [ ] All text uses `--dn-text-primary` or `--dn-text-secondary` — no raw whites
- [ ] All interactive elements have `:focus-visible` with `--dn-border-strong` outline
- [ ] All touch targets ≥ 44×44px (buttons, links, interactive icons)
- [ ] All cards, buttons, inputs use `--dn-radius-xs` (fully rounded)
- [ ] Hover states on all cards and buttons include `--dn-shadow-1` green glow
- [ ] Spacing uses only `--dn-space-*` tokens — no arbitrary px/rem values
- [ ] `prefers-reduced-motion: reduce` disables all translate/scale/rotate/opacity animations
- [ ] Empty states handled: illustration + heading + CTA for zero-data views
- [ ] Long content truncation applied: 2-line clamp on card titles, ellipsis on overflowing text
- [ ] Keyboard navigation verified: every action reachable via Tab + Enter/Space
- [ ] Modals trap focus and return focus to trigger on close
