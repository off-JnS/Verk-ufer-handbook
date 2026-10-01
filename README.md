# Hamburg Demo Suite — Three Service Tiers, Nine Real Sectors

This project contains **nine complete, client-ready demo websites** built for my web design agency's portfolio — **three demos per service tier** (**Starter**, **Professional**, **Premium**), each targeting a different, commercially relevant sector that is easy to find in Hamburg, Germany. All visible content is in **German** (the target market); all code comments and this README are in English.

Every business shown is **fictional**, with invented but plausible Hamburg addresses, phone numbers, and email addresses.

| Folder | Sector | Tier | Fictional business |
|---|---|---|---|
| [`/gastro-basic/`](gastro-basic/index.html) | Gastronomy (café & roastery) | **STARTER** | Röstwerk Ottensen GmbH |
| [`/friseur-basic/`](friseur-basic/index.html) | Hair salon | **STARTER** | Haarwerk Winterhude |
| [`/tischlerei-basic/`](tischlerei-basic/index.html) | Carpentry / joinery | **STARTER** | Tischlerei Holtkamp |
| [`/immobilien-professional/`](immobilien-professional/index.html) | Real estate agency | **PROFESSIONAL** | Elbstein Immobilien GmbH |
| [`/zahnarzt-professional/`](zahnarzt-professional/index.html) | Dental practice | **PROFESSIONAL** | Elbzahn – Praxis für Zahnmedizin |
| [`/architektur-professional/`](architektur-professional/index.html) | Architecture studio | **PROFESSIONAL** | Fleetwerk Architekten GmbH |
| [`/maritim-premium/`](maritim-premium/index.html) | Maritime logistics | **PREMIUM** | Nordmeridian Logistik GmbH |
| [`/windenergie-premium/`](windenergie-premium/index.html) | Offshore wind O&M | **PREMIUM** | Elbwind Offshore GmbH |
| [`/aviation-premium/`](aviation-premium/index.html) | Aviation supplier & MRO | **PREMIUM** | Hanseatic Aerotec GmbH |
| [`/ehsos-referenz/`](ehsos-referenz/index.html) | Burger restaurant (Hamburg Lurup) | **REFERENCE** | Ehso's Burger — *a real, shipped client project* |

The root [`index.html`](index.html) hub is the **client-facing showcase**, built for a phone or an iPad mini held in front of a prospect. It opens with a screenshot gallery of all nine demos (filterable by tier) and the Ehso's reference; tapping any of them opens a **full-screen in-page viewer** with prev/next arrows and a close button, so the client never leaves the hub. The viewer pushes a single `#demo=<slug>` history entry, so the browser back button and the iPad edge swipe close it; `index.html#demo=maritim-premium` deep-links straight into a demo. Below that: the three packages (tabs under 900 px, three columns above), a decision helper, a package comparison (stacked per criterion on phones), the maintenance plans and the combination-discount calculator backed by a static table. Phones get a fixed bottom tab bar; from 744 px (iPad mini portrait) a sticky top bar with section links replaces it. The hub can be added to the home screen (`site.webmanifest`, `assets/icon-180.png`) and then opens without browser chrome.

**Thumbnails.** The gallery images in `assets/thumbs/` are real screenshots (desktop 1280×800 and phone 390×844) encoded as WebP, ~480 KB in total. After changing a demo, regenerate them with `npx -y -p playwright node tools/capture-thumbs.mjs` (uses the locally installed Google Chrome).

**Stack:** 100 % vanilla HTML/CSS/JS. No frameworks, no build step. External resources: Google Fonts, `picsum.photos` placeholder imagery, and (maritim-premium only) Three.js from the jsDelivr CDN. The two newer Premium heroes use hand-written Canvas 2D — zero dependencies.

---

## Why three demos per tier?

Same package, three different sectors — so a prospect can see that the *tier* defines scope and features, while sector, art direction, and content change per client. The demos are deliberately built so the **price difference is verifiable in the browser**:

| Cost driver | STARTER | PROFESSIONAL | PREMIUM |
|---|---|---|---|
| Pages | 1 (one-pager) | 5 custom pages + sitemap.xml | 5 custom pages + sitemap.xml |
| Motion | Hover states **only** — deliberately no scroll animation | Scroll reveals, animated counters, staggered timelines, filters | All of Professional **plus a custom-coded immersive hero** (WebGL/Canvas) |
| SEO | Basic meta tags only — deliberately no JSON-LD/OG | JSON-LD, Open Graph/Twitter, BreadcrumbList, sitemap.xml, GBP callout | Same as Professional |
| Design | Clean template-level | Curated typography & palette | Full custom design system (colour, type, mono-label language) |
| Copy | Client-supplied | Client-supplied | Professional copywriting included |
| Support | 2 revision rounds (badge) | Unlimited revisions (badge) | Priority support & launch (badge) |

Every demo carries a fixed corner badge naming its tier and support level. Prices on the hub are **1.000 € / 1.750 € / 2.750 €**, one-off, plus a maintenance plan.

---

## Pricing model on the hub

**Websites (one-off):** Starter 1.000 € · Professional 1.750 € · Premium 2.750 €

**Maintenance (monthly):** Basic 59 € · Standard 99 € · Premium 149 €
— a deliberately *different* naming set and colour family (teal, not the warm tier colours), so "maintenance Premium" is never mistaken for "website Premium".

Each tier is cumulative, and every line item carries a plain-German explanation on the card, because the customer is reading it over the seller's shoulder on a phone:

| Tier | Contents |
|---|---|
| **Basic 59 €** | Hosting · Domain-Verwaltung · Uptime-Überwachung |
| **Standard 99 €** | *everything in Basic, plus* monatlicher Bericht per E-Mail · kleine inhaltliche Änderungen |
| **Premium 149 €** | *everything in Standard, plus* Google-Business-Profil-Pflege · laufende Google-Optimierung |

Deliberately **not** offered, and therefore not written anywhere on the page: backups, SSL certificates, security updates, guaranteed response times, change quotas. An earlier draft promised these; do not reintroduce them without deciding to actually sell them.

**Combination discounts** — taking a maintenance plan discounts the one-off website price:

| Maintenance | Starter 1.000 € | Professional 1.750 € | Premium 2.750 € |
|---|---|---|---|
| **Basic — 59 €/mo** | −100 % → 0 € | −50 % → 750 € | −25 % → 2.000 € |
| **Standard — 99 €/mo** | −100 % → 0 € | −100 % → 0 € | −50 % → 1.250 € |
| **Premium — 149 €/mo** | −100 % → 0 € | −100 % → 0 € | −100 % → 0 € |

Discounts require a **24-month minimum term**.

Prices are rounded **down** to the next multiple of 250 € (`STEP` / `offerPrice()` in the inline script), so the customer always pays a round figure. The badge keeps showing the *advertised* percentage while the actual discount is a little larger — −50 % on Professional bills at 750 €, i.e. −57 %. Rounding only ever moves in the customer's favour, and the fine print under the table says so.

The hub renders these numbers twice: the calculator computes them from the `SITES`/`CARE` arrays, and the static table below it is hardcoded — **keep the two in sync when prices change**.

The maintenance cards live in the `.care-grid` block in [`index.html`](index.html); each `<li>` is a `<strong>` name plus a `<span>` explanation.

---

## STARTER tier — one-pagers (3 demos)

Starter sites share one honest constraint set: single `index.html` + `style.css` + ~90-line `script.js` (mobile nav, form validation, footer year). No scroll reveals, no structured data, no OG tags — those are what you pay Professional for. Motion is deliberately limited to hover states: the mobile menu is a plain dropdown under the sticky header (no drawer, overlay or staggered entries), the hero renders instantly without an entry animation, and there are no decorative extras like stamps, marquees or sawtooth dividers. The sites still look finished — typography, palette and imagery carry them — so the step up to Professional is visible without Starter looking cheap. All are responsive, fast (no JS libraries, `display=swap` fonts, lazy images with explicit dimensions), and include a validated contact form with simulated success plus a commented Formspree `action` and commented GA4 snippet.

### 1. Röstwerk Ottensen — café & roastery
Warm cream/espresso/terracotta; Fraunces + Karla. Menu with dotted price leaders, Hamburg copy (Franzbrötchen, Zeise-Hallen, harbour beans).
*Contact:* Bahrenfelder Straße 87, 22765 Hamburg · +49 40 555 123 40 · hallo@roestwerk-ottensen.de

### 2. Haarwerk Winterhude — hair salon
Blush paper, rosewood accent; DM Serif Display + Nunito Sans. Structured price list (Schnitt/Farbe/Styling) with "no surprises" note, three team cards, two testimonials, appointment-request form.
*Contact:* Mühlenkamp 34, 22303 Hamburg · +49 40 555 210 77 · hallo@haarwerk-winterhude.de

### 3. Tischlerei Holtkamp — carpentry
Pine paper, forest green + oiled-oak accents; Bitter + Work Sans. Four service cards with inline-SVG icons, three work samples, a 3-step "So läuft's" process (static — the *animated* timeline is a Professional feature), 48-h response promise.
*Contact:* Hufnerstraße 118, 22305 Hamburg · +49 40 555 342 18 · moin@tischlerei-holtkamp.de

---

## PROFESSIONAL tier — 5-page sites (3 demos)

Professional sites share: five pages, one `css/main.css` + one `js/main.js` per site (no duplication), IntersectionObserver scroll reveals with staggered delays, animated stat counters (German decimal comma, `de-DE` grouping), transparent-to-solid sticky header, JSON-LD on the home page + `BreadcrumbList` on subpages, full OG/Twitter tags, `sitemap.xml`, a Google-Business-Profile callout card on the contact page, five-field validated form with GDPR checkbox, and the "Unbegrenzte Revisionen" badge. All animation is transform/opacity only; observers unobserve after firing; `prefers-reduced-motion` disables everything.

### 1. Elbstein Immobilien — real estate
"Exaggerated minimalism": Cormorant Garamond + Jost, navy/sand/brass. Live Kauf/Miete listing filter (progressive enhancement), Ken Burns hero, animated counters, hand-drawn SVG map. JSON-LD `RealEstateAgent`.
*Contact:* Am Sandtorkai 42, 20457 Hamburg · +49 40 555 678 90 · kontakt@elbstein-immobilien.de

### 2. Elbzahn — dental practice (pages: Start, Leistungen, Praxis, Team, Kontakt)
Calm medical mint/teal; Sora + Mulish. Six-service grid, **5-step treatment timeline** animating in sequence, `<details>` FAQ, practice gallery with tall-tile grid, Google-stars review cards, counters incl. grouped `12.400` patients. JSON-LD `Dentist`.
*Contact:* Eppendorfer Landstraße 60, 20249 Hamburg · +49 40 555 481 30 · praxis@elbzahn.de

### 3. Fleetwerk Architekten — architecture studio (pages: Start, Projekte, Leistungen, Büro, Kontakt)
Editorial look: oversized Syne headlines, warm-gray paper, oxide red, deliberately square buttons, desaturated photography. **Project filter** (Wohnen/Gewerbe/Öffentlich), **HOAI Leistungsphasen 1–9 timeline**, awards list, "96 % im Kostenrahmen" counter story. JSON-LD `ProfessionalService`.
*Contact:* Admiralitätstraße 17, 20459 Hamburg · +49 40 555 764 12 · studio@fleetwerk-architekten.de

---

## PREMIUM tier — 5-page sites with custom immersive experiences (3 demos)

Premium sites include everything in Professional **plus**: a custom-coded immersive hero (each one different tech, to show range), a complete bespoke design system with monospace coordinate/spec-label language, professional German copywriting (founder statements, benefit-led services, concrete CTAs), a Premium package card with 24/7 hotline on the contact page, and the "Priority Support & Launch" badge. Crucially, the three Premium demos also use **three structurally different page layouts** — Nordmeridian's classic vertical dark dramaturgy, Elbwind's control-room split (telemetry panel in the hero, numbered operation rows, hazard-stripe dividers, inverted yellow CTA), and Aerotec's engineering-document system (drawing title-block hero, riveted data plate, bento grid, annotated figures) — because "Premium" must visibly mean *no off-the-shelf grid*. All three heroes are performance-defensive: pixel-ratio capped at 2, **pause when the tab is hidden or the hero scrolls out of view**, `prefers-reduced-motion` renders a static frame, and a pure-CSS fallback remains if WebGL/canvas is unavailable.

**Interactive heroes.** Each hero answers to the pointer *and* to touch: Nordmeridian's globe can be dragged to spin (with inertia; vertical scrolling stays native via `touch-action: pan-y`), gets an additive atmosphere halo and pulls back as you scroll; Elbwind's wind field treats the pointer or a fingertip as a gust source that bends and lights up the streaks (a tap fires a blast); Aerotec's blueprint turns the pointer into a measuring crosshair with coordinates, a dimension line to XFW and an object snap to route destinations (a tap pins it for a moment).

**Motion layer (`css/fx.css` + `js/fx.js`).** One hand-written module, byte-identical in all three Premium folders, themed through `--fx-*` tokens in each site's `:root`. No libraries. It adds:

- **Page transitions** — cross-document View Transitions (`@view-transition`): the header and tier badge stay put while the new page wipes up from below; browsers without support get a short fade-out. Repeat visits to a home page in one session skip the loader (inline `sessionStorage` flag in `<head>`).
- **Headlines** — every `h1`/`h2` in `main` is split into words that rise out of a mask on reveal; mono kickers decode with a short text scramble.
- **Images** — content photos wipe open with a `clip-path` mask; hero copy drifts and fades as it scrolls out (`data-fx-hero`).
- **Pointer effects** (mouse/trackpad only, never touch) — magnetic buttons, 3D tilt with glare on cards, a trailing cursor ring (blend-mode difference, labels like "Drehen" or "Messen" over the heroes) and a spotlight glow on `.fx-spot` panels.
- **Velocity marquees** — port and spec tickers speed up, reverse and skew with the scroll velocity (`data-fx-marquee`).
- **Horizontal showcase** (`data-fx-hs`) — a pinned section whose card track slides sideways while you scroll down: Nordmeridian's six trade lanes, Elbwind's fleet & equipment, Aerotec's shop-floor tour. Without JS or with reduced motion it is a normal swipeable row.
- **Scroll story** (`data-fx-story`) — a sticky visual (on phones: pinned above the text) driven by five steps: a shipment Hamburg → Shanghai whose route draws itself and whose ship stops at each port; a drone inspecting a rotor blade until the rotor spins again; a galley bracket going from drawing through machining and CMM measurement to a stamped first-article approval. Stops are found automatically from `[data-fx-stop]` points on the path.
- **SVG drawing and timelines** — route maps on Netzwerk/Windparks draw themselves (`data-fx-draw`), history and process lists fill a progress line and light up passed entries (`data-fx-timeline`).

Everything is progressive enhancement: with `prefers-reduced-motion` nothing splits, wipes, tilts or pins, and the pages read completely without JS.

### 1. Nordmeridian Logistik — maritime logistics · **Three.js WebGL globe**
Dark maritime system: ink `#05090F`, signal orange, sonar cyan; Space Grotesk + Inter + mono labels. 1,500-dot particle globe, pulsing Hamburg hub, eight great-circle arcs with travelling cargo pulses, departure-board route table, inline-SVG world map on the Netzwerk page.
*Contact:* Bei St. Annen 12, 20457 Hamburg · +49 40 555 910 20 · kontakt@nordmeridian-logistik.de

### 2. Elbwind Offshore — offshore wind O&M · **Canvas 2D wind-field simulation** (pages: Start, Leistungen, Windparks, Über uns, Kontakt)
North Sea storm system: deep petrol, turbine-warning yellow, steel blue, sea glass; Archivo + IBM Plex Sans/Mono. ~600 streak particles follow a layered-sine flow field with gusts; CSS-animated turbine silhouettes in the foreground. **Control-room layout:** the hero is a split with a live telemetry panel (blinking status dot, fleet counters, next weather window) instead of a stats band; services are full-width numbered operation rows with outlined giant numerals; sections divide with hazard stripes; the CTA band inverts to warning yellow. Plus: "Einsatzübersicht" departure board, inline-SVG sea map, T+0→T+26h deployment timeline, cycling wind readout.
*Contact:* Veritaskai 4, 21079 Hamburg-Harburg · +49 40 555 892 40 · kontakt@elbwind-offshore.de

### 3. Hanseatic Aerotec — aviation supplier & MRO · **Canvas 2D blueprint flight map** (pages: Start, Leistungen, Qualität, Über uns, Kontakt)
Deliberately the **light** counterpoint to the two dark Premium demos — Premium means a *custom* system, not a dark one. Porcelain paper, engineering grid, blueprint blue, safety orange; Chakra Petch + Albert Sans + Space Mono. The hero draws a fine blueprint grid, dash-animated great-circle routes from XFW/Finkenwerder, orange plane markers flying the arcs (ping-pong), a pulsing hub, and a rotating compass rose. **Engineering-document layout:** the hero copy sits in a technical-drawing title block (registration crosshairs, Zeichnungs-Nr./Rev./Maßstab/Status meta row, hard offset shadow); the stats are a riveted machine type plate ("Typenschild"); services are a bento grid with POS-numbers and a photo lead panel; the founder photo carries drawing-style annotation chips. Plus: program board table, certification cards, quality-KPI counters, 25-year milestones, AOG-desk premium card.
*Contact:* Neßpriel 5, 21129 Hamburg-Finkenwerder · +49 40 555 623 80 · kontakt@hanseatic-aerotec.de

---

## REFERENCE — Ehso's Burger (`/ehsos-referenz/`)

The one entry here that is **not** a demo: a real, shipped client site for a burger restaurant in Hamburg Lurup, built *before* the three-tier pricing existed. It does not map onto Starter/Professional/Premium — the hub gives it its own dark band ("Referenz · Individualprojekt", price on request) using the client's own brand colours (`#111` / `#f97316`), so it never reads as a fourth price tier.

React SPA (react-router, react-helmet-async), WebGL hero via `ogl`, GSAP motion, Lenis smooth scrolling, 50+ menu items with allergen codes, three locations with opening-hours logic, ordering via Lieferando/Wolt/Uber Eats, a GDPR cookie banner with Google Consent Mode v2, JSON-LD `Restaurant`, and a `sharp`-based image pipeline.

**How the folder was produced.** The client repo lives outside this project and was **not modified**. Its `ehsosburger.de` domain no longer resolves and its `main` branch was replaced by a holding page, so the folder is a static build made in a scratch copy:

1. Restore the real app: `git show fad8938:src/App.jsx > src/App.jsx`
2. `BrowserRouter` → `HashRouter` in `src/main.jsx`, so the site needs no server rewrite rules and runs from any subfolder.
3. `base: './'` in `vite.config.js`; the six hard `href="/…"` internal links become `href="#/…"`.
4. `noindex = true` as the default in `src/components/SEO.jsx`.
5. `npx vite build` (skips `optimize-images`, whose output is already in `public/`; `copy-routes.js` is moot under hash routing).
6. Post-build, rewrite the ~67 absolute public-asset paths in `dist/assets/*.js` — `"/images/` → `"images/` and the same for `menu-images`, `videos`. The replacement is anchored on the quote so absolute `https://ehsosburger.de/images/…` URLs inside the JSON-LD survive.
7. Strip the two gtag.js blocks from `dist/index.html`. A portfolio copy must not write hits into the client's GA4 property; `CookieBanner` guards on `typeof window.gtag === 'function'`, so it still behaves.
8. Drop `_redirects`, `robots.txt` and `sitemap.xml` — meaningless for a hash-routed folder copy.

Two menu images (`Paratha Burger`, `Crepe mit Nutella`) were referenced as `.jpeg` while only `.webp` was ever shipped — a pre-existing 404 on the live site, corrected in this copy.

---

## Design-system separation (no two demos look alike)

| Demo | Display font | Body font | Signature colours |
|---|---|---|---|
| Röstwerk (Starter) | Fraunces | Karla | cream / espresso / terracotta |
| Haarwerk (Starter) | DM Serif Display | Nunito Sans | blush / plum / rosewood |
| Holtkamp (Starter) | Bitter | Work Sans | pine / walnut / forest green |
| Elbstein (Pro) | Cormorant Garamond | Jost | sand / navy / brass |
| Elbzahn (Pro) | Sora | Mulish | mint-white / teal-slate / teal |
| Fleetwerk (Pro) | Syne | Manrope | warm gray / near-black / oxide red |
| Nordmeridian (Premium) | Space Grotesk | Inter (+ mono) | night ink / signal orange / sonar cyan |
| Elbwind (Premium) | Archivo | IBM Plex Sans (+ Plex Mono) | petrol / warning yellow / steel blue |
| Aerotec (Premium) | Chakra Petch | Albert Sans (+ Space Mono) | porcelain / blueprint blue / safety orange |

---

## Mobile experience & signature details

Every site is verified for small screens (fluid grids collapse to one column, tables scroll inside their own container, headers drop their `backdrop-filter` on mobile so the fixed-position menus are never trapped in the header's containing block). From Professional upwards **no two mobile menus are alike** — each one is designed in the site's own language, with staggered link animation, ESC-to-close, scroll-lock, and a contextual footer (hours/phone/coordinates, injected by each site's script):

| Demo | Mobile menu concept | Entry/loading animation | Signature element |
|---|---|---|---|
| Röstwerk | Plain dropdown (Starter) | none — instant render | — |
| Haarwerk | Plain dropdown (Starter) | none — instant render | — |
| Holtkamp | Plain dropdown (Starter) | none — instant render | — |
| Elbstein | "Exposé" overlay: brass brochure frame, oversized italic serif | Navy loader: wordmark + brass rule | Ken Burns hero (existing) |
| Elbzahn | App-style bottom sheet with grab handle and full-width CTA | Mint loader: tooth pulse | Sticky "Akut?"-call pill (mobile) |
| Fleetwerk | "Werkverzeichnis": full-screen numbered index on plan-grid paper | Oxide wipe reveals wordmark | Outline wordmark marquee |
| Nordmeridian | "Kontrollturm": radar rings, mono waypoint numbers, coordinates footer | Sonar-ping loader | Three.js globe (existing) |
| Elbwind | "Leitwarte": wind-streak dark panel, W1–W4 waypoint codes, 24/7 line | Rotor spin-up loader | Live cycling wind readout in the hero |
| Aerotec | "Boarding": blueprint grid, GATE-01…04 rows, AOG footer | Plane crosses a dashed runway | Mono spec ticker under the metrics |

Each demo stylesheet ends with a **"Mobile polish"** block: `[hidden]` always wins (form success messages stay hidden until sent), 44 px tap targets for menu toggle, logo, breadcrumbs and footer links, hyphenation for long German compounds only (`hyphenate-limit-chars`), a compact tier badge on phones, hover lifts neutralised on touch screens, and taller nav hit areas on tablets. All nine demos are audited at 360, 390, 430 px, landscape phone (844×390) and iPad mini (744 px): no horizontal overflow, every scroll reveal resolves, menus fully tappable. In the Premium motion layer, masked images are observed through their parent (Chrome ignores clipped images for IntersectionObserver and lazy loading), the horizontal showcase falls back to a swipe row on short landscape screens, and hero copy only drifts/fades when it fits the viewport.

Loaders are **pure CSS** (auto-dismiss ~1.2 s, `pointer-events: none`, `display: none` under `prefers-reduced-motion`) and exist only on Professional/Premium home pages — Starter deliberately has none, because instant load is that tier's selling point.

---

## Setup

No build step, no dependencies to install:

1. Open any demo's `index.html` in a modern browser — that's it.
2. Or open the root `index.html` for the hub with all nine demos and the pricing rationale.
3. Internet needed once for Google Fonts and `picsum.photos` images; maritim-premium additionally loads Three.js from jsDelivr. The Elbwind and Aerotec heroes are dependency-free Canvas 2D.

To check the hub the way a customer will see it, serve the folder rather than opening `file://`, then load it on the phone over the LAN:

```
python3 -m http.server 8080
```

**Wiring the forms later:** each form tag has a commented-out `action="https://formspree.io/f/your-id" method="POST"` — uncomment, insert your Formspree ID, and remove the `e.preventDefault()` line noted in each script.

**Analytics:** each `<head>` contains a commented gtag.js block — uncomment and insert your GA4 Measurement ID.

**Prices:** see "Pricing model on the hub" above. Changing a price means editing several places in `index.html`: the gallery card badges, the tier panel / maintenance card markup, the comparison and discount table headers, the static discount table, and the `SITES`/`CARE` arrays in the inline script that feed the discount calculator.

**Performance:** all sites avoid blocking resources (deferred scripts, `display=swap` fonts, lazy images with explicit dimensions, compositor-only animations) and are built to score ≥ 90 in Lighthouse Performance. Note that `picsum.photos` adds real network latency — swap in optimized local images before running formal audits or going live.
