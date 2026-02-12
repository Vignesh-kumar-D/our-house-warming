/**
 * Client-side color palette extraction from images.
 * Uses canvas pixel sampling + k-means clustering.
 */

type RGB = [number, number, number];

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface Cluster {
  center: RGB;
  weight: number;
  hsl: HSL;
  lum: number;
}

export interface Theme {
  bg0: string;
  bg1: string;
  text: string;
  accent: string;
  accent2: string;
  leaf: string;
  stroke: string;
  surface: string;
  surface2: string;
  muted: string;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function dist2(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function fmtRgb([r, g, b]: RGB): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;
  await img.decode();
  return img;
}

function samplePixels(
  img: HTMLImageElement,
  { maxW = 96, maxH = 96, maxSamples = 4500 } = {},
): RGB[] {
  const canvas = document.createElement("canvas");
  const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  const pixels: RGB[] = [];

  const stride = Math.max(1, Math.floor((w * h) / maxSamples));
  for (let i = 0; i < data.length; i += 4 * stride) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 40) continue;
    if (r + g + b < 38) continue;

    pixels.push([r, g, b]);
  }
  return pixels;
}

function kmeans(pixels: RGB[], k = 7, iters = 10): Cluster[] {
  if (pixels.length === 0) return [];

  const centers: RGB[] = [];
  const step = Math.max(1, Math.floor(pixels.length / k));
  for (let i = 0; i < k; i++) centers.push([...pixels[(i * step) % pixels.length]]);

  const assignments = new Array<number>(pixels.length).fill(0);

  for (let t = 0; t < iters; t++) {
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = dist2(pixels[i], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      assignments[i] = best;
    }

    const sums = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3] += 1;
    }
    for (let c = 0; c < centers.length; c++) {
      if (sums[c][3] === 0) continue;
      centers[c][0] = sums[c][0] / sums[c][3];
      centers[c][1] = sums[c][1] / sums[c][3];
      centers[c][2] = sums[c][2] / sums[c][3];
    }
  }

  const clusters: Cluster[] = centers.map((center) => ({
    center,
    weight: 0,
    hsl: rgbToHsl(center[0], center[1], center[2]),
    lum: luminance(center[0], center[1], center[2]),
  }));
  for (const a of assignments) clusters[a].weight += 1;

  return clusters.filter((c) => c.weight > 0).sort((a, b) => b.weight - a.weight);
}

function pickPalette(clusters: Cluster[]): Omit<Theme, "stroke" | "surface" | "surface2" | "muted"> | null {
  if (!clusters.length) return null;

  const byLum = [...clusters].sort((a, b) => b.lum - a.lum);
  const light1 = byLum[0];
  const light2 = byLum.find((c) => c !== light1) || light1;
  const dark1 = [...clusters].sort((a, b) => a.lum - b.lum)[0];

  const mid = clusters
    .filter((c) => c !== light1 && c !== light2 && c !== dark1)
    .sort((a, b) => b.hsl.s - a.hsl.s);

  const accent = mid[0] || light2;
  const accent2 = mid[1] || accent;

  const leafCandidate =
    clusters
      .filter((c) => c.hsl.s > 0.18)
      .filter((c) => c.hsl.h >= 70 && c.hsl.h <= 170)
      .sort((a, b) => b.hsl.s - a.hsl.s)[0] || accent2;

  return {
    bg0: fmtRgb(light1.center),
    bg1: fmtRgb(light2.center),
    text: fmtRgb(dark1.center),
    accent: fmtRgb(accent.center),
    accent2: fmtRgb(accent2.center),
    leaf: fmtRgb(leafCandidate.center),
  };
}

export async function extractThemeFromImages(imageUrls: string[]): Promise<Theme | null> {
  const imgs = await Promise.all(imageUrls.map(loadImage));
  const pixels = imgs.flatMap((img) => samplePixels(img));

  if (pixels.length < 250) return null;

  const clusters = kmeans(pixels, 8, 12);
  const palette = pickPalette(clusters);
  if (!palette) return null;

  return {
    ...palette,
    stroke: "color-mix(in srgb, var(--text) 18%, transparent)",
    surface: "color-mix(in srgb, #ffffff 82%, transparent)",
    surface2: "color-mix(in srgb, #ffffff 68%, transparent)",
    muted: "color-mix(in srgb, var(--text) 68%, transparent)",
  };
}

export function applyThemeVars(theme: Theme): void {
  const root = document.documentElement;

  root.style.setProperty("--bg0", theme.bg0);
  root.style.setProperty("--bg1", theme.bg1);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent2", theme.accent2);
  root.style.setProperty("--leaf", theme.leaf);

  if (theme.stroke) root.style.setProperty("--stroke", theme.stroke);
  if (theme.surface) root.style.setProperty("--surface", theme.surface);
  if (theme.surface2) root.style.setProperty("--surface2", theme.surface2);
  if (theme.muted) root.style.setProperty("--muted", theme.muted);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.bg0);
}

export function softenTextColor(): void {
  const cs = getComputedStyle(document.documentElement);
  const text = cs.getPropertyValue("--text").trim();
  if (!text.startsWith("rgb")) return;
  const m = text.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/);
  if (!m) return;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if (luminance(r, g, b) > 0.68) {
    document.documentElement.style.setProperty("--text", "rgb(26 22 16)");
    document.documentElement.style.setProperty(
      "--muted",
      "color-mix(in srgb, rgb(26 22 16) 68%, transparent)",
    );
  }
}
