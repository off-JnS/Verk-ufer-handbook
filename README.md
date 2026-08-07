# Hamburg Demo Suite — Three Service Tiers, Nine Real Sectors

This project contains **nine complete, client-ready demo websites** built for my web design agency's portfolio — **three demos per service tier** (**Basic**, **Professional**, **Premium**), each targeting a different, commercially relevant sector that is easy to find in Hamburg, Germany. All visible content is in **German** (the target market); all code comments and this README are in English.

Every business shown is **fictional**, with invented but plausible Hamburg addresses, phone numbers, and email addresses.

| Folder | Sector | Tier | Fictional business |
|---|---|---|---|
| [`/gastro-basic/`](gastro-basic/index.html) | Gastronomy (café & roastery) | **BASIC** | Röstwerk Ottensen GmbH |
| [`/friseur-basic/`](friseur-basic/index.html) | Hair salon | **BASIC** | Haarwerk Winterhude |
| [`/tischlerei-basic/`](tischlerei-basic/index.html) | Carpentry / joinery | **BASIC** | Tischlerei Holtkamp |
| [`/immobilien-professional/`](immobilien-professional/index.html) | Real estate agency | **PROFESSIONAL** | Elbstein Immobilien GmbH |
| [`/zahnarzt-professional/`](zahnarzt-professional/index.html) | Dental practice | **PROFESSIONAL** | Elbzahn – Praxis für Zahnmedizin |
| [`/architektur-professional/`](architektur-professional/index.html) | Architecture studio | **PROFESSIONAL** | Fleetwerk Architekten GmbH |
| [`/maritim-premium/`](maritim-premium/index.html) | Maritime logistics | **PREMIUM** | Nordmeridian Logistik GmbH |
| [`/windenergie-premium/`](windenergie-premium/index.html) | Offshore wind O&M | **PREMIUM** | Elbwind Offshore GmbH |
| [`/aviation-premium/`](aviation-premium/index.html) | Aviation supplier & MRO | **PREMIUM** | Hanseatic Aerotec GmbH |

The root [`index.html`](index.html) hub links to all nine demos **and contains a "Warum der Preisunterschied?" section**: example prices per tier, a cost-driver table, and per-tier explanations a prospect can verify by clicking through the demos.

**Stack:** 100 % vanilla HTML/CSS/JS. No frameworks, no build step. External resources: Google Fonts, `picsum.photos` placeholder imagery, and (maritim-premium only) Three.js from the jsDelivr CDN. The two newer Premium heroes use hand-written Canvas 2D — zero dependencies.

---

## Why three demos per tier?

Same package, three different sectors — so a prospect can see that the *tier* defines scope and features, while sector, art direction, and content change per client. The demos are deliberately built so the **price difference is verifiable in the browser**:

| Cost driver | BASIC | PROFESSIONAL | PREMIUM |
|---|---|---|---|
| Pages | 1 (one-pager) | 5 custom pages + sitemap.xml | 5 custom pages + sitemap.xml |
| Motion | Hover states **only** — deliberately no scroll animation | Scroll reveals, animated counters, staggered timelines, filters | All of Professional **plus a custom-coded immersive hero** (WebGL/Canvas) |
| SEO | Basic meta tags only — deliberately no JSON-LD/OG | JSON-LD, Open Graph/Twitter, BreadcrumbList, sitemap.xml, GBP callout | Same as Professional |
| Design | Clean template-level | Curated typography & palette | Full custom design system (colour, type, mono-label language) |
| Copy | Client-supplied | Client-supplied | Professional copywriting included |
| Support | 2 revision rounds (badge) | Unlimited revisions (badge) | Priority support & launch (badge) |

Every demo carries a fixed corner badge naming its tier and support level. Example prices on the hub (990 € / 2.900 € / 7.500 €) are **placeholders — swap in your own calculation**.

---

## BASIC tier — one-pagers (3 demos)

Basic sites share one honest constraint set: single `index.html` + `style.css` + ~90-line `script.js` (mobile nav, form validation, footer year). No scroll reveals, no structured data, no OG tags — those are what you pay Professional for. All are responsive, fast (no JS libraries, `display=swap` fonts, lazy images with explicit dimensions), and include a validated contact form with simulated success plus a commented Formspree `action` and commented GA4 snippet.

### 1. Röstwerk Ottensen — café & roastery
Warm cream/espresso/terracotta; Fraunces + Karla. Menu with dotted price leaders, rotating "100 % Arabica" hero stamp, Hamburg copy (Franzbrötchen, Zeise-Hallen, harbour beans).
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

## Design-system separation (no two demos look alike)

| Demo | Display font | Body font | Signature colours |
|---|---|---|---|
| Röstwerk (Basic) | Fraunces | Karla | cream / espresso / terracotta |
| Haarwerk (Basic) | DM Serif Display | Nunito Sans | blush / plum / rosewood |
| Holtkamp (Basic) | Bitter | Work Sans | pine / walnut / forest green |
| Elbstein (Pro) | Cormorant Garamond | Jost | sand / navy / brass |
| Elbzahn (Pro) | Sora | Mulish | mint-white / teal-slate / teal |
| Fleetwerk (Pro) | Syne | Manrope | warm gray / near-black / oxide red |
| Nordmeridian (Premium) | Space Grotesk | Inter (+ mono) | night ink / signal orange / sonar cyan |
| Elbwind (Premium) | Archivo | IBM Plex Sans (+ Plex Mono) | petrol / warning yellow / steel blue |
| Aerotec (Premium) | Chakra Petch | Albert Sans (+ Space Mono) | porcelain / blueprint blue / safety orange |

---

## Mobile experience & signature details

Every site is verified for small screens (fluid grids collapse to one column, tables scroll inside their own container, headers drop their `backdrop-filter` on mobile so the fixed-position menus are never trapped in the header's containing block). **No two mobile menus are alike** — each one is designed in the site's own language, with staggered link animation, ESC-to-close, scroll-lock, and a contextual footer (hours/phone/coordinates, injected by each site's script):

| Demo | Mobile menu concept | Entry/loading animation | Signature element |
|---|---|---|---|
| Röstwerk | "Tageskarte": serif entries with dotted price leaders, hours as card footer | Hero settles in (no loader — Basic sells speed) | Rotating Arabica stamp |
| Haarwerk | Boudoir drawer from the right, numbered serif entries, blurred scrim | Hero settle + stamp pop | Service marquee strip (✂-separated) |
| Holtkamp | Tool-cabinet drawer from the left, walnut dark, ruler-tick edge | Hero settle | Sawtooth divider on tinted sections |
| Elbstein | "Exposé" overlay: brass brochure frame, oversized italic serif | Navy loader: wordmark + brass rule | Ken Burns hero (existing) |
| Elbzahn | App-style bottom sheet with grab handle and full-width CTA | Mint loader: tooth pulse | Sticky "Akut?"-call pill (mobile) |
| Fleetwerk | "Werkverzeichnis": full-screen numbered index on plan-grid paper | Oxide wipe reveals wordmark | Outline wordmark marquee |
| Nordmeridian | "Kontrollturm": radar rings, mono waypoint numbers, coordinates footer | Sonar-ping loader | Three.js globe (existing) |
| Elbwind | "Leitwarte": wind-streak dark panel, W1–W4 waypoint codes, 24/7 line | Rotor spin-up loader | Live cycling wind readout in the hero |
| Aerotec | "Boarding": blueprint grid, GATE-01…04 rows, AOG footer | Plane crosses a dashed runway | Mono spec ticker under the metrics |

Loaders are **pure CSS** (auto-dismiss ~1.2 s, `pointer-events: none`, `display: none` under `prefers-reduced-motion`) and exist only on Professional/Premium home pages — Basic deliberately has none, because instant load is that tier's selling point.

---

## Setup

No build step, no dependencies to install:

1. Open any demo's `index.html` in a modern browser — that's it.
2. Or open the root `index.html` for the hub with all nine demos and the pricing rationale.
3. Internet needed once for Google Fonts and `picsum.photos` images; maritim-premium additionally loads Three.js from jsDelivr. The Elbwind and Aerotec heroes are dependency-free Canvas 2D.

**Wiring the forms later:** each form tag has a commented-out `action="https://formspree.io/f/your-id" method="POST"` — uncomment, insert your Formspree ID, and remove the `e.preventDefault()` line noted in each script.

**Analytics:** each `<head>` contains a commented gtag.js block — uncomment and insert your GA4 Measurement ID.

**Prices:** the hub's example prices (990 / 2.900 / 7.500 €) are placeholders — adjust to your own calculation before showing clients.

**Performance:** all sites avoid blocking resources (deferred scripts, `display=swap` fonts, lazy images with explicit dimensions, compositor-only animations) and are built to score ≥ 90 in Lighthouse Performance. Note that `picsum.photos` adds real network latency — swap in optimized local images before running formal audits or going live.
