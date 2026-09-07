# Shubukan India — Design System

This document is the single source of truth for how this site looks, feels, and is built visually. Read it before touching any UI — whether you're a human developer or an AI agent — so new work matches what's already here instead of introducing a fourth visual language.

**Companion Figma file:** ["Shubukan Design"](https://www.figma.com/design/iqLgm5otKiE5ElphZqQLe8) — color swatches, type specimens, and component references that mirror this document visually.

---

## 1. Brand & Concept

Shubukan India teaches Okinawan Shuri-te karate and kobudo, lineage traced back to Okinawa. The visual identity leans into that: **traditional Japanese craft aesthetics** — rice paper, ink, hand-brushed calligraphy, a red hanko (seal) accent — rather than a generic "sporty" martial-arts look (no aggressive angular shapes, no neon, no stock gym photography treatment).

The wordmark and hero moments use hand-lettered/brush-style display type; body content stays in clean, legible sans-serif. The result should feel like a **respected traditional dojo with a serious, well-run administrative side** — warm and crafted where a visitor lands, precise and quiet where a guardian, instructor, or admin does actual work.

---

## 2. Three Design Layers

The codebase is really **three visual languages under one roof**, each tuned to its audience. Never blend them — pick the right one for where you're building.

| Layer | Where | Feel | Key files |
|---|---|---|---|
| **Main site** | Marketing pages — home, history, dojo listings, gallery, blog, contact, karate & kobudo, lineage | Warm, energetic, hand-crafted, playful animation | `styles/variables.scss`, `styles/Fonts.scss`, `app/globals.css`, `components/Navbar/`, `components/Home/` |
| **Guardian Evaluation (GEF)** | `/guardian-evaluation/*` — guardian/instructor/admin evaluation-form module | Serene "Japanese scroll" — muted rice-paper palette, bilingual-ready, checkbox-driven forms | `components/GuardianEvaluation/gef-theme.css` |
| **Admin / Exam utility** | `/admin`, `/online-exam` internals | Plain, dense, function-first — Tailwind utility classes, neutral grays, no brand flourish | `components/AdminPanel/`, `components/Exam/` |

The GEF layer is the most deliberately designed of the three and is the reference implementation for **how to build a new self-contained module well** — its own theme file, its own CSS variable namespace (`--gef-*`), its own component library (`components/GuardianEvaluation/UI/`). Follow that pattern (a scoped `*-theme.css` + a `UI/` folder of primitives) when adding a new module of comparable size, rather than scattering one-off styles through page components.

---

## 3. Color System

### 3.1 Main site palette (`styles/variables.scss`)

| Token | Hex | Role |
|---|---|---|
| `$accent0` (primary) | `#DE3614` | Primary accent — active nav state, selection color, CTAs, text-shadow glow on hover |
| `$accent1` | `#A64B37` | Secondary warm rust |
| `$accent2` | `#D9C8A9` | Warm tan/khaki |
| `$accent3` (ink) | `#2A2727` | Primary dark text / headings |
| `$accent4` | `#403D3C` | Dark warm gray |
| `$accent5` | `#BFB2AA` | Warm gray-beige, muted UI |
| `$accent6` | `#88807E` | Mid warm gray, secondary text |
| `$accent7` | `#000000` | True black (sparing use) |
| `$accent8` | `#FFFDDE` | Cream/ivory background |
| `$accent9` | `#EBE0D6` | Light warm beige background |

`$accent0` (`#DE3614`) is *the* brand color — it's the text-selection color (`::selection`), the active-nav-link color, and the glow used on hover/active states across the Navbar. Treat it as the single primary accent for the main site; don't introduce a second "primary" red/orange.

### 3.2 Guardian Evaluation (GEF) palette (`gef-theme.css`, `.gef-root` custom properties)

| Token | Hex | Role |
|---|---|---|
| `--gef-rice` | `#F5E9D8` | Base warm paper tone |
| `--gef-rice-soft` | `#FAF3E7` | Lighter paper, card/input backgrounds |
| `--gef-ink` | `#1C1A17` | Primary text |
| `--gef-vermillion` | `#A61B1B` | Primary accent — buttons, links, active states, focus rings (deliberately a different, deeper red from the main site's `$accent0`, evoking a hanko stamp rather than a UI brand color) |
| `--gef-vermillion-soft` | `#C53A3A` | Secondary accent, emphasis text |
| `--gef-gold` | `#C6A75E` | Tertiary accent — "gold" button variant, draft-status tint |
| `--gef-charcoal` | `#2A2A2A` | Secondary dark, pending-status text |
| `--gef-line` | `rgba(28, 26, 23, 0.16)` | Hairline borders/dividers everywhere in this module |
| `--gef-shadow` | `0 6px 18px rgba(28, 26, 23, 0.1)` | Standard soft elevation shadow |

**Do not reuse `--gef-vermillion` outside `.gef-root`-scoped markup** — it's a CSS custom property defined only on that class, so anything rendered outside it (e.g. a portal, or markup injected before hydration) will see it resolve to nothing. Nest new GEF-module UI inside a `.gef-root` ancestor.

Status-badge tints (derive from the palette above, always at low opacity over a white-ish base so text stays legible):
- Draft → gold family, `rgba(198,167,94,0.18)` bg / `#6f5726` text
- Submitted → sage green (the one color introduced outside the core palette, since "success" reads oddly in vermillion) — `rgba(107,142,90,0.18)` bg / `#3f5c34` text
- Pending → `rgba(28,26,23,0.08)` bg / `--gef-charcoal` text

### 3.3 Belt rank colors (`components/GuardianEvaluation/UI/BeltRankSelect.jsx`)

A fixed, literal palette matching real belt colors — used only for the rank picker, never repurposed as generic UI color:

`White #FFFFFF` (bordered, since it's on a light background) → `Yellow #F5E23C` → `Orange #F2994A` → `Green #4CAF50` → `Blue #4A9DE0` → `Purple #A64AC9` → `Brown #6B4226` (4th–1st Kyu, distinguished by 1–4 red stripe marks, not color) → `Black #1C1C1C`.

### 3.4 Choosing text color on a swatch

Every colored surface picks white or ink/charcoal text by contrast, not by convention — check contrast per swatch (see belt colors above: white/yellow/orange/green use dark text, blue/purple/brown/black use white text).

---

## 4. Typography

Three different typographic identities, matching the three design layers.

### 4.1 Main site

| Family | Source | Used for |
|---|---|---|
| **Fredericka the Great** | Google Font | Navbar logo-swap heading (page title shown in place of the logo on scroll/hover) |
| **Amanojaku** (local, `--font-amanojaku`) | `app/fonts/Amanojaku.woff2` | Homepage & blog hero headlines — brush-calligraphy display face |
| **Mufan** (local, `--font-mufan`) | `app/fonts/MufanPFS.woff2` | Secondary display accent |
| **Philosopher** | Google Font | Navbar dropdown menu items |
| **Geo** (as `Geo2` OTF) | Local OTF | The "MENU" toggle label — monospace-ish, small, tracked-out |
| **Lekton** | Google Font | Toasts, general UI micro-copy — a typewriter-ish accent for short system messages |
| **Amarante** | Google Font | Available as a secondary display option (`--font-amarante`) |
| System sans (Tailwind default) | — | Body copy on marketing pages |

`styles/Fonts.scss` also `@font-face`-registers a **large (100+) grab-bag library of decorative brush/calligraphy TTF/OTF fonts** (Yoppa, Brushido, Geishta, Motterdam, dozens more). Only a small number of these are ever actually applied via a class name in real components — **grep for a font's exact family name in `app/` and `components/` before assuming it's live**; most of the file is an unused asset library, not an active type system. Don't add a page's heading font by picking blindly from this file — check usage first, and prefer the fonts already listed above unless there's a specific reason to introduce a new one.

### 4.2 Guardian Evaluation (GEF)

A deliberate two-family bilingual system, declared as CSS variables on `.gef-root`:

```css
--gef-font-heading: "Shippori Mincho", "Noto Serif JP", serif;
--gef-font-body: "Noto Sans JP", -apple-system, "Segoe UI", sans-serif;
```

- **Shippori Mincho** — section headings ("For Students", "For the Teacher"), the form title, card titles. A traditional Japanese serif that reads as formal/ceremonial without being decorative.
- **Noto Sans JP** — everything else: field labels, values, buttons, body copy. Chosen specifically because it renders Latin, Bengali-adjacent, and CJK glyphs cleanly in one family, important for a form used by guardians who may need non-English rendering support (this is also why the generated PDF and the on-screen form deliberately stay English-only now with translation delegated to the site's own Translate control, rather than hand-maintaining a second language — see `util/evaluationFormLabels.js` in the backend).
- Font sizes scale via a single inline `font-size` on `.gef-form-scale` (the mobile font-size slider) — every descendant is sized in `em`, never a hardcoded `px`, so it inherits that scale. When adding a new GEF text element, size it in `em` relative to the existing scale, not a fresh `px` value.

### 4.3 Admin / Exam utility

Plain system/Tailwind default sans stack, no custom display type. This is intentional — these surfaces exist to be used quickly by staff, not to represent the brand.

---

## 5. Iconography

`react-icons`, primarily the **Feather set (`Fi*`)** for the GEF/admin UI (`FiHome`, `FiChevronLeft`, `FiLogOut`, `FiUser`, `FiEdit3`, `FiVolume2`, ...) — thin-stroke, geometric, quiet. `Fa*` (Font Awesome) appears for a few specific marks (`FaChalkboardTeacher`, `FaCheckCircle`/`FaTimesCircle`/`FaExclamationTriangle` in the toast component, `GiKimono` from `react-icons/gi` for the karate-specific section icon). Stick to Feather as the default for any new icon; reach for Fa/Gi only when Feather has no equivalent glyph (as with the kimono icon).

Icon badges in GEF forms alternate a "gold" and "vermillion" tone per section (see `.gef-doc-section-icon--vermillion` in `gef-theme.css`) — purely decorative rhythm, not semantic; don't read meaning into which sections get which tone.

---

## 6. Custom Cursors & Micro-details

The main site replaces the OS cursor entirely (`app/globals.css`), a small but distinctive branding touch:

| Cursor | Applies to | File |
|---|---|---|
| Normal | `body` | `/cursors/NormalSelect.cur` |
| Link/pointer | `a`, `button`, `.pointer` | `/cursors/LinkSelect.cur` |
| Text | `input`, `textarea` | `/cursors/TextSelect.cur` |
| Help | `.help-cursor` | `/cursors/HelpSelect.cur` |
| Move | `.move-cursor` | `/cursors/Move.cur` |
| Precision/crosshair | `.precision-cursor` | `/cursors/PrecisionSelect.cur` |
| Busy | `.wait-cursor` | `/cursors/Busy.ani` |

The scrollbar is also custom-styled: white track, black thumb with a tomato-colored top/bottom border cap (`body::-webkit-scrollbar*` in `globals.css`). These are WebKit-only and degrade gracefully (default scrollbar/cursor) on browsers that don't support them — that's fine, don't spend effort on a Firefox equivalent.

---

## 7. Layout & Spacing

- **Main site**: Tailwind utility classes for layout (`app/globals.css` imports `tailwindcss` directly, Tailwind v4 CSS-first config — there is no `tailwind.config.js`). Custom SCSS modules (`ComponentName.scss`, `@use`-ing `styles/variables.scss`) handle anything Tailwind utilities don't cleanly express (the Navbar's blob/turbulence hero effect, keyframe animations).
- **GEF module**: hand-written CSS in `gef-theme.css`, BEM-ish flat class names all prefixed `gef-` (`.gef-row-card`, `.gef-modal-backdrop`, `.gef-nav-bar`). A 46px page margin, a small set of reusable structural classes (`.gef-stack` for vertical rhythm, `.gef-row` for a two-up field row, `.gef-list` for card lists) — reuse these instead of inventing new spacing utility classes for a new GEF screen.
- **Cards** are the primary content container in GEF (`.gef-card`) and admin (Tailwind `rounded-*` cards) alike — soft corner radius (10–18px depending on component), a hairline border, and a very light warm-white background (`#fffdf8`–`#faf3e7` range), never pure white.
- **Responsive breakpoints** used throughout GEF: `800px`, `700px`, `640px`, `500px` — not Tailwind's default scale. Match these when adding new responsive rules to the module so behavior changes at the same points existing UI already does.

---

## 8. Components

The GEF module (`components/GuardianEvaluation/UI/`) is the canonical component library — treat it as the pattern to extend, and the admin/exam UI as the "keep it simple" counter-example.

| Component | File | Notes |
|---|---|---|
| `Button` | `UI/Button.jsx` | Variants: `primary` (vermillion fill), `outline` (bordered, transparent), `gold`, `danger` (vermillion border+text, transparent fill). `size="sm"` and `block` modifiers. |
| `Field` / `TextInput` / `TextArea` / `Select` / `YesNo` / `ChipMultiSelect` / `DailyOrBeforeExam` | `UI/FormFields.jsx` | Ink-brush underline style inputs (bottom-border only, soft fill, no boxed border) — see `.gef-input`/`.gef-select` in the theme file. `YesNo`/`ChipMultiSelect`/checkboxes are custom `<button>`-based, not native inputs, styled as pill-cornered rows with a small square tick box. `ReadOnlyContext` (exported from this file) swaps `TextInput`/`TextArea` to a plain wrapping `<div>` when a form is read-only, so long content is never invisibly clipped by a native single-line/fixed-height control. |
| `Modal` | `UI/Modal.jsx` | Backdrop + centered card, `wide` prop for content needing more room (e.g. the PDF viewer). Locks body scroll while open; also flips the global `UIContext.isModalOpen` flag so the site Navbar hides itself while any modal is open. |
| `ConfirmModal` | `UI/ConfirmModal.jsx` | Thin wrapper over `Modal` for a single confirm/cancel destructive action. |
| `BeltRankSelect` | `UI/BeltRankSelect.jsx` | Custom colored dropdown — trigger shows the selected belt's real color + stripe count, not a plain text select. |
| Browser-style tabs | `.gef-tabs` / `.gef-tab` in `gef-theme.css` | Concave-corner "physical browser tab" shape via the two-square `corner1`/`corner2` CSS trick (see the shared "Commentron" reference this pattern was ported from). Used for Admin's "Evaluation Windows / Submitted Forms" toggle — this is the *only* place this shape belongs; don't reach for it as a generic tab component. |
| Status badge | `.gef-badge`, `.gef-badge--draft/submitted/pending` | Pill, uppercase, tracked-out label, low-opacity tint background matching the status's semantic color. |
| Row card | `.gef-row-card` + `.gef-row-card-actions` | The standard list-item shape for learners, windows, submissions — title/subtitle on the left, action buttons on the right, stacking to a vertical layout under 640px. |
| `PdfViewer` / `PdfViewerModal` | `components/UIComponent/PdfViewer.jsx`, `GuardianEvaluation/UI/PdfViewerModal.jsx` | `react-pdf`-based inline viewer inside a `wide` `Modal`. Used for admin/instructor "View"; the guardian-facing "View" instead shows the live, read-only form (see §4.2 on why) — Download still produces the real PDF everywhere. |
| Toast | `components/UIComponent/Toast/Toast.jsx` | Bottom-right stack, colored left border per type (success/error/info/warning), auto-dismiss (`addToast(message, type, durationMs)` — default 4s, pass a longer duration for messages with more to read). |

---

## 9. Motion & Animation

Deliberately soft and slow — nothing snappy or "bouncy." Typical easing is `ease-in-out`, typical duration 200ms–1s depending on scale (button hover: ~150ms; Navbar slide-in: 200ms; Navbar auto-hide-on-scroll: full 1s `transition: all 1s ease-in-out`).

Named keyframe patterns already in use — reuse these names/shapes for new work rather than inventing new easing curves:
- `navSlide` / `headingSlide` — slide + fade-in on mount (Navbar.scss)
- Toast `slideIn` — translateY + fade
- `notFound` — scale pulse (0.8 → 1.2 → 1) for empty/404 states

The GEF module additionally uses a **scroll-driven sticky/fixed transition** for the mobile font-size slider (`GefNav.jsx` + `.gef-form-font-slider-wrap--stuck`): it lives in normal flow inside the nav bar by default, and switches to `position: fixed` (via a JS scroll listener watching a sentinel element's position, not CSS `position: sticky` — sticky's containing-block constraint doesn't survive the nav bar scrolling fully out of view) once scrolled past. This is the reference pattern for any future "stays reachable while scrolling a long form" UI.

---

## 10. Imagery & Texture

- **Rice paper / hatch texture**: `.gef-root` carries a subtle low-opacity asanoha-like hatch pattern as a background layer — never a flat solid color for a large GEF surface.
- **Soft white "cloud" blobs**: the Navbar's hero area uses a large soft-edged white ellipse (`#cloud-circle`) with an SVG `feTurbulence`/`feDisplacementMap` filter for an organic, hand-drawn edge — reused wherever the main site wants a soft focal backdrop behind a logo or heading.
- **Hanko/seal motif**: a filled circle in the primary accent color reads as a Japanese name-seal stamp — used sparingly as a graphic accent (see the Figma cover page), not as a repeating pattern.
- **Photography**: dojo/training photos are treated plainly (no heavy filter/duotone) — the *chrome around* the photo (cards, borders, warm background) carries the brand style, not the photo itself.

---

## 11. Voice & Tone

- **Main site marketing copy**: respectful, historical, a little formal — reflects a decades-old traditional dojo lineage, not a modern fitness-studio tone.
- **GEF module copy**: plain, warm, parent-facing. Explains *why* a field matters ("so instructors can support each student better") rather than just labeling it. Error/confirmation copy names the actual thing that happened or is at risk, never a generic "Something went wrong" (e.g. "Please fill in: Age, Date of Birth, ... and 35 more required fields" rather than a bare failure count).
- **Admin/instructor copy**: terse and functional — these are internal tools, not brand touchpoints.

---

## 12. Accessibility Notes

- Every custom checkbox/toggle/select is a real `<button>`/`<select>`/`<input>` under the hood (never a `<div onClick>`), so native focus, keyboard activation, and `<fieldset disabled>` cascading all work correctly — this is *why* the whole read-only GEF form can be locked with one `<fieldset disabled>` wrapper instead of touching every field.
- Color is never the only signal: status badges carry a text label, not just a color; checked/selected states get a filled box or border-color change plus (in the generated PDF) an actual checkmark glyph, not color alone.
- Respect the custom-cursor and hatch-texture choices above, but never let them reduce text/background contrast — check contrast per-surface, especially for belt-color swatches and status-badge tints.

---

## 13. Pages & What the Site Delivers

Every route below, what it actually delivers, and the component that owns it — so a new page can be judged against a real precedent instead of guessed at. Descriptions are pulled from each page's own SEO metadata where one exists (the most authoritative, deliberately-written statement of that page's purpose), not paraphrased from the route name.

### 13.1 Main site — marketing & information (design layer: §2 "Main site")

| Route | Component | Delivers |
|---|---|---|
| `/` | `Home/Home.jsx` | The homepage — "Shubukan India \| Traditional Okinawan Karate Dojo." First impression: what the dojo is, its Okinawan lineage, and entry points into the rest of the site. |
| `/history` | `History/History.jsx` | The dojo's own history and its roots in Okinawan karate. |
| `/shubukan-india` | `ShubukanIndia/ShubukanIndia.jsx` | The India dojo itself — setup, instructors, training environment, values. |
| `/shubukan-okinawa` | `ShubukanOkinawa/ShubukanOkinawa.jsx` | Shubukan Okinawa, the root organization in Japan, and its mission to preserve traditional martial arts. |
| `/shubukan-world` | `ShubukanWorld/ShubukanWorld.jsx` | The global footprint — Shubukan dojos and the international community around them. |
| `/shuri-karate-kobudo-hozonkai` | `Hozonkai/Hozonkai.jsx` | Explains the Shuri Karate Kobudo Hozonkai — the Okinawan preservation society this lineage answers to. |
| `/lineage-and-dojokun` | `LineageAndDojoKun/LineageAndDojoKun.jsx` | The lineage of masters, and the Dojo Kun — the guiding principles that define the dojo's philosophy. |
| `/karate-and-kobudo` | `KarateAndKobudo/KarateAndKobudo.jsx` | What's actually taught: the fundamentals of Shorin Ryu Karate and Kobudo (weapons), and how instruction is structured. |
| `/dojo-listicle` | `IndiaDojo/IndiaDojo.jsx` | Membership pitch — programs, benefits, and how to enroll, listing dojo locations. |
| `/gallery` | `Gallery/Gallery.jsx` | Photos and videos from training sessions, belt exams, seminars, and events. |
| `/journal` | `Blog/Blog.jsx` | The blog listing — articles on traditional karate, Kobudo, dojo life, training tips, martial arts culture. |
| `/blogpost/[slug]` | `Blog/BlogPost/BlogPost.jsx` | A single blog article's full reading view (share button, view-count tracking). |
| `/blogpost/blog-not-found` | `Blog/BlogPost/BlogNotFound.jsx` | Fallback shown when a blog slug doesn't resolve to a real post. |
| `/contributors` | `Contributor/Contributor.jsx` | Credits the team and supporters who help maintain the dojo and this website. |
| `/services` | `Services/Services.jsx` | The training programs on offer, from kids' classes to advanced full-contact karate. |
| `/registration` | `Registration/Registration.jsx` | The actual sign-up flow to join Shubukan India. |
| `/contact` | `Contact/Contact.jsx` | Contact details and ways to reach the dojo. |
| `/help-and-faqs` | `HAndF/HAndF.jsx` | Answers to common questions — training, registration, equipment, and other dojo logistics. |
| `/term-and-condition` | `TAndC/TAndC.jsx` | The legal terms and conditions for using the site and dojo services. |
| `/marksheet` | `Marksheet/Marksheet.jsx` | Public belt-examination result/progress lookup, by student code — the one place a plain marksheet PDF viewer (`components/UIComponent/PdfViewer.jsx`, currently disabled here) was originally wired in. |
| `/dev` | `Dev/Dev.jsx` | An internal scratch/testing page, currently empty — not part of the public site; don't treat it as a real route when auditing pages. |

### 13.2 Guardian Evaluation module (design layer: §2 "GEF")

The full guardian/instructor/admin evaluation-form workflow. See `DESIGN_SYSTEM.md` §2–§9 for the visual language; this is what each route in it *does*.

| Route | Delivers |
|---|---|
| `/guardian-evaluation` | Landing/home-gate (`HomeGate.jsx`) — shows a marketing `Landing.jsx` to a logged-out visitor explaining what the form is for, or the guardian `Dashboard.jsx` (learners list + open evaluation windows) once logged in. |
| `/guardian-evaluation/signup`, `/login`, `/verify` | Guardian account creation and email-OTP sign-in. |
| `/guardian-evaluation/form/[learnerId]/[windowId]` | The evaluation form itself — fill a new draft, continue one, edit within the 5-minute post-submission window, or (past that window) view a read-only copy of what was submitted. One route serves all four states; see §4.2/§8. |
| `/guardian-evaluation/submissions` | A guardian's own list of every draft/submitted form across all their learners (`Submissions/MySubmissions.jsx`), with View/Edit/Download PDF actions. |
| `/guardian-evaluation/instructor`, `/instructor/login` | Instructor sign-in and their own submitted-forms-for-their-students view (`Instructor/InstructorSubmissions.jsx`) — read/download only, no editing. |
| `/guardian-evaluation/admin`, `/admin/login` | Admin sign-in and the admin dashboard (`Admin/AdminDashboard.jsx`) — browser-tab-styled toggle between "Evaluation Windows" (open a new window, edit/close an open one) and "Submitted Forms" (view/download every submission). Auth-guarded by `AdminAuthGuard.jsx`, which always redirects an unauthenticated *or* unauthorized (invalid/expired token) session to login. |

### 13.3 Online Exam module

A separate instructor/student examination portal (question banks, timed exams, results) — visually the plainest of the three layers (§2), Tailwind-utility UI with no brand styling layered on.

| Route | Delivers |
|---|---|
| `/online-exam` | Module landing page (`Exam/OnlineExam.jsx`) — entry point into the instructor or student portal. |
| `/online-exam/instructor`, `/login`, `/signup`, `/login-signup`, `/verify` | Instructor account creation and sign-in. |
| `/online-exam/instructor/papers` | Create/manage exam papers (question sets, timing, settings). |
| `/online-exam/instructor/students` | The instructor's roster of students. |
| `/online-exam/instructor/upcoming` | Upcoming/scheduled exams for the instructor's students. |
| `/online-exam/instructor/results` | Results across the instructor's exams. |
| `/online-exam/instructor/profile` | Instructor's own account/profile settings. |
| `/online-exam/student`, `/login`, `/signup`, `/login-signup`, `/verify` | Student account creation and sign-in. |
| `/online-exam/student/open-exams` | Exams currently available for the student to take. |
| `/online-exam/student/results` | The student's own past results. |
| `/online-exam/student/profile` | Student's own account/profile settings. |
| `/online-exam/[examId]`, `/online-exam/public/[examId]` | The actual exam-taking view for a specific exam (public link variant included for exams shared outside a logged-in session). |

### 13.4 Admin panel (site-wide content management)

Distinct from the Guardian Evaluation module's *own* admin section (§13.2) — this is the general site CMS at `/admin`, gated by the same `/admin/validate`-checked auth pattern (`AdminPanel/Layout.jsx`).

| Route | Component | Manages |
|---|---|---|
| `/admin` | `AdminPanel/Dashboard.jsx` | Admin landing/overview. |
| `/admin/login` | — | Admin sign-in. |
| `/admin/banner` | `AdminPanel/BannerManager.jsx` | The site-wide scrolling banner — content, active/inactive state, and which pages it shows on. |
| `/admin/blogs` | `AdminPanel/BlogManager.jsx` | Blog posts shown at `/journal` and `/blogpost/[slug]`. |
| `/admin/gallery` | `AdminPanel/GalleryManager.jsx` | Photos/videos shown at `/gallery`. |
| `/admin/dojo` | `AdminPanel/DojoManager.jsx` | The dojo directory (locations/instructors) surfaced at `/dojo-listicle` and used by the guardian-evaluation learner picker. |
| `/admin/instructors` | `AdminPanel/InstructorManager.jsx` | The instructor roster/codes used across both the Guardian Evaluation module and Online Exam. |
| `/admin/students` | `AdminPanel/StudentManager.jsx` | Student records. |
| `/admin/exams` | `AdminPanel/ExamManager.jsx` | Exams offered through the Online Exam module. |
| `/admin/questions` | `AdminPanel/QuestionManager.jsx` | The question bank exams are built from. |
| `/admin/results` | `AdminPanel/ResultManager.jsx` | Exam results records. |

---

## 14. Guidelines for Extending This System

1. **Identify which of the three layers you're in** (§2) before writing any CSS — that decides your palette, fonts, and spacing scale.
2. **In the GEF module**, add new component primitives to `components/GuardianEvaluation/UI/` and new styles to `gef-theme.css` under a `.gef-*` class — never inline a one-off color hex that isn't one of the tokens in §3.2.
3. **Reuse before inventing.** A row-card, a badge, a modal, a checkbox row — these patterns already exist. A new screen should be assembled from them, not given its own bespoke card/button shape.
4. **Keep the two content languages (English-only GEF form + Translate-button i18n) as the model** for any future multi-language need — don't hand-maintain a second hardcoded language in a new module; that was tried and reverted once already (see `util/evaluationFormLabels.js` history).
5. **When in doubt, check what's actually used**, not what's declared — `styles/Fonts.scss` is the clearest example of declared-but-mostly-unused assets in this codebase; grep before assuming a token/font/class is live.
6. **Update this file and the Figma companion together** when you introduce a genuinely new token, font, or reusable pattern — both should stay a faithful mirror of the real, shipped design.
