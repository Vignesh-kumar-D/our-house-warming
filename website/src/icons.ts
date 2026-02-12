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
    `<path d="M17.47 14.38c-.29-.14-1.7-.84-1.96-.93s-.46-.14-.65.14-.74.93-.91 1.12-.34.21-.62.07a7.82 7.82 0 0 1-3.84-3.35c-.29-.5.29-.46.83-1.54a.53.53 0 0 0-.03-.5c-.07-.14-.65-1.56-.89-2.13s-.47-.48-.65-.49h-.55a1.07 1.07 0 0 0-.77.36 3.24 3.24 0 0 0-1.01 2.4 5.6 5.6 0 0 0 1.18 2.98 12.86 12.86 0 0 0 4.94 4.37c2.94 1.27 2.94.85 3.47.8a2.94 2.94 0 0 0 1.95-1.38 2.4 2.4 0 0 0 .17-1.38c-.07-.12-.26-.19-.55-.34ZM12 2a10 10 0 0 0-8.52 15.27L2 22l4.89-1.44A10 10 0 1 0 12 2Z"/>`,
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
