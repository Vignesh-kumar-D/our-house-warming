/**
 * Inline SVG icon helpers — avoids external icon libraries.
 */

function svg(paths: string, vb = "0 0 24 24"): SVGSVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox", vb);
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = paths;
  return el;
}

export function iconPhone(): SVGSVGElement {
  return svg(
    `<path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"/>`,
  );
}

export function iconWhatsApp(): SVGSVGElement {
  return svg(
    `<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.82 13.97c-.25.7-1.47 1.34-2.03 1.42-.53.08-1.2.11-1.94-.12-.44-.14-1.01-.34-1.74-.67-3.07-1.37-5.07-4.49-5.22-4.7-.16-.21-1.24-1.65-1.24-3.15s.78-2.24 1.07-2.55c.28-.3.62-.38.82-.38h.59c.19 0 .45-.07.7.53.25.62.87 2.13.95 2.28.07.16.12.34.02.55-.1.21-.15.34-.3.52-.15.18-.32.4-.46.54-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.15.99 2.13 1.3 2.43 1.45.3.15.48.13.65-.08.18-.21.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.74.82 2.04.97.3.15.49.22.57.35.07.12.07.7-.18 1.4Z"/>`,
  );
}

export function iconMapPin(): SVGSVGElement {
  return svg(
    `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>`,
  );
}

export function iconArrowRight(): SVGSVGElement {
  return svg(`<path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/>`);
}
