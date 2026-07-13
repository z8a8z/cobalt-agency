# Behavioural Operating Manual for Antigravity Frontend Agents

This operating manual governs project architecture, styling guidelines, responsive layouts, accessibility, and performance budgets.

## 1. Component & Code Conventions
*   **Functional Components**: Write pure functional React components.
*   **Strict Types**: Use explicit interface declarations for all props. Do not use `any`.
*   **Semantic Naming**: Class and file names must match their responsibility.

## 2. Styling & CSS Standards
*   **No Arbitrary Values**: All margins, paddings, gaps, and color values must use tokens declared in `DESIGN.md` as CSS Custom Properties.
*   **Borders**: Restrict full box borders. Use whitespace, backgrounds, or design-system accent border utilities (`.accent-border-top`, `.accent-border-left`).

## 3. Responsive Behavior
*   **Breakpoints**: Page layouts must be designed and verified across five core widths: `360px`, `390px`, `768px`, `1024px`, and `1440px`.
*   **Fluid scaling**: Implement dynamic layouts using flexbox/grid configurations and fluid sizing expressions like `clamp()`, `min()`, `max()`.

## 4. Accessibility Requirements
*   **Heading Nesting**: Maintain consecutive nested headings (`h1` -> `h2` -> `h3`). Ensure there is only one `<h1>` per page.
*   **Focus Rings**: Enforce explicit focus states (`:focus-visible` or `.focus-ring`) on all links, buttons, and inputs.
*   **Image Alt Texts**: All images must contain alt tags (either description-rich or explicitly empty `alt=""` if decorative).

## 5. Performance Standards
*   **Optimized Image Loading**: Apply `loading="lazy"` only to below-the-fold images. The primary hero image above-the-fold must load eagerly.
*   **Modern Asset Formats**: Use WebP or AVIF for imagery and SVGs for icons. Avoid legacy uncompressed PNGs/JPGs.
*   **FPS Target**: Maintain a smooth 60fps refresh rate by keeping animations focused on GPU-accelerated attributes (`transform`, `opacity`).

## 6. Prevention of Scaling Blur in Embedded/Scaled Documents
*   **Avoid backdrop-filter in Scaled Containers**: In Chromium-based browsers, applying a CSS `transform: scale()` or zoom on an iframe or viewport wrapper causes the browser to rasterize the entire document at low resolution (losing subpixel antialiasing and causing blurriness) if the document contains any CSS `backdrop-filter` or `-webkit-backdrop-filter` rules.
*   **Glass Fills**: For mockups, iframes, and components that will be scaled or zoomed, strictly prohibit using CSS `backdrop-filter`. Instead, use high-contrast semi-transparent solid backgrounds (e.g. `rgba(255, 255, 255, 0.06)` or hex colors) to simulate glass.
*   **Font Smoothing**: Enforce font-smoothing properties (`-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`) inside iframe templates to keep scaled text sharp.
