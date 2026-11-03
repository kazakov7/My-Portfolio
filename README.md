# Kevin — Full-Stack & AI Engineer

A React portfolio rebuilt around the supplied `image 8.pdf` design reference: deep navy hero, bright blue accents, Poppins typography with Kaushan Script headings, rounded cards and asymmetric curved sections.

## Development

```sh
pnpm install
pnpm dev
pnpm build
```

The production output is `dist/`. No backend, database or API credentials are required.

## Layout

- Desktop page maximum width: **1300 px**.
- Dedicated mobile composition below 768 px, checked at 390 px and 320 px.
- English and Korean interface. The language choice is stored locally.
- Hero, profile, services, work experience, education, complete skills catalog, project mosaic, collaboration banner, engineering approach carousel, engineering notes, technology wordmarks, social cards, contact and footer.

## Content

- `src/content.js`: the five project profiles and work experience.
- `src/design-content.js`: localized website copy, full skills catalog, services and engineering notes.
- `src/App.jsx`: React sections and browser interactions.
- `src/styles.css`: reference-based visual design and mobile styles.
- `public/assets/`: user portraits and real project screenshots extracted from supplied PDFs; the collaboration illustration is cropped from the supplied design reference.
- `public/Kevin-Resume.pdf`: supplied one-page resume.
- `public/Kevin-Portfolio.pdf`: downloadable 31-page portfolio.

All five skills categories are visible by default. Category buttons filter them. Education cards expand. Work experience cards update the adjacent personal project spotlight. Project tiles and notes open a modal with verified project details. The engineering approach carousel contains the author's principles, not client testimonials. The contact form prepares a mailto draft in the visitor's email app; it does not claim to send or store messages.

The reference's fictional people, employers, testimonials, blog entries and partner logos have been replaced with the user's own data and project content. Stripe is explicitly described as test mode.

## Interactive 3D

- `src/HeroOrbit.jsx`: lazy-loaded Three.js portrait disc, metallic rim, illuminated orbital rings and moving satellites. Uses a CSS 3D composition when WebGL 2 is unavailable.
- `src/useDepthMotion.js`: frame-throttled pointer tracking for 22 cards, layered content, perspective and highlights.
- The top `FX` button pauses/resumes motion and remembers the preference. Reduced-motion settings default to paused.
- Card tilt is limited to desktop mouse/trackpad input. Touch scrolling remains native. WebGL caps rendering at 30 FPS (20 FPS on coarse-pointer devices) and caps pixel ratio. Rendering and CSS animation pause when hidden or offscreen.

Verified desktop perspective transforms, pause/resume cleanup, offscreen suspension, project dialogs and responsive layout. The QA browser has WebGL disabled, so GPU appearance requires verification on a WebGL-capable device; the CSS 3D rendering was visually inspected.

## Motion and swipers

- Swiper 12 project showcase: 3D coverflow, mouse drag / touch swipe, keyboard arrows, labeled navigation, project pagination and opt-in autoplay. The original five-card grid is available through All Projects.
- The engineering approach section uses a separate touch-enabled fade swiper with its own arrows and pagination.
- Project autoplay stops on hover, reading focus, document hiding, offscreen visibility, open dialogs / navigation, or disabled motion. It is off by default.
- `src/usePageMotion.js` handles one-time scroll reveals through the Web Animations API and IntersectionObserver. It keeps animation transforms separate from existing 3D card transforms. A slim progress indicator follows reading position.
- The FX control pauses decorative motion and autoplay. System reduced-motion preferences default to paused. Mouse and touch navigation remain available with immediate slide changes when motion is off.

Verified arrows, keyboard navigation, mouse dragging, mobile-width dragging, tap-versus-drag handling, grid switching, project dialogs, autoplay start / pause, and the global FX control. Desktop remains capped at 1300 px; mobile layouts were checked at 390 px and 320 px.
