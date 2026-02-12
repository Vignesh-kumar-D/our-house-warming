/**
 * Section 3 — Locate & Contact Us
 * Two-column on desktop, stacked on mobile.
 */
import { iconPhone, iconWhatsApp, iconMapPin } from "../icons";

/* ── Config ── */
const MAPS_OPEN_URL = "https://maps.app.goo.gl/ngKzAwHuTJLKNnDF6";
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("2nd Cross, Aero Nagar Extension, Kadampadi, Sulur, Coimbatore") +
  "&output=embed";

interface Contact {
  name: string;
  phone: string;
}

const CONTACTS: Contact[] = [
  { name: "Vignesh Kumar", phone: "+91 89038 31083" },
  { name: "Tarun Kumar", phone: "+91 63692 55795" },
];

/* ── Helpers ── */
function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function waHref(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}

function iconLink(
  href: string,
  label: string,
  icon: SVGSVGElement,
  variant?: "wa" | "call",
): HTMLAnchorElement {
  const a = document.createElement("a");
  a.className = `icon-btn${variant ? ` icon-btn--${variant}` : ""}`;
  a.href = href;
  a.target = href.startsWith("http") ? "_blank" : "";
  a.rel = href.startsWith("http") ? "noreferrer" : "";
  a.setAttribute("aria-label", label);
  a.append(icon);
  return a;
}

function ContactCard(c: Contact): HTMLElement {
  const card = document.createElement("div");
  card.className = "contact-card";
  card.dataset.anim = "contact-card";

  const nameEl = document.createElement("div");
  nameEl.className = "contact-card__name";
  nameEl.textContent = c.name;

  const phoneEl = document.createElement("div");
  phoneEl.className = "contact-card__phone";
  phoneEl.textContent = c.phone;

  const actions = document.createElement("div");
  actions.className = "contact-card__actions";
  actions.append(
    iconLink(telHref(c.phone), `Call ${c.name}`, iconPhone(), "call"),
    iconLink(waHref(c.phone), `WhatsApp ${c.name}`, iconWhatsApp(), "wa"),
  );

  card.append(nameEl, phoneEl, actions);
  return card;
}

/* ── Section ── */
export function LocateContact(): HTMLElement {
  const section = document.createElement("section");
  section.className = "locate-contact";
  section.dataset.section = "locate-contact";
  section.setAttribute("aria-label", "Locate and contact us");

  /* Header */
  const header = document.createElement("div");
  header.className = "container locate-contact__header";
  header.dataset.anim = "section-header";
  header.innerHTML = `
    <p class="kicker">Directions & Help</p>
    <h2 class="heading-2">Locate & Contact Us</h2>
  `;

  /* Grid */
  const grid = document.createElement("div");
  grid.className = "container locate-contact__grid";

  /* Left — Location card */
  const locationCard = document.createElement("article");
  locationCard.className = "card";
  locationCard.id = "locate";
  locationCard.dataset.anim = "location-card";
  locationCard.setAttribute("aria-label", "Location");

  const locBody = document.createElement("div");
  locBody.className = "card__body";

  const locHeading = document.createElement("h3");
  locHeading.className = "heading-3";
  locHeading.textContent = "Location";

  const locAddress = document.createElement("p");
  locAddress.className = "location-address";
  locAddress.textContent =
    "2nd Cross, Aero Nagar Extension, Kadampadi, Sulur, Coimbatore";

  const locActions = document.createElement("div");
  locActions.className = "location-actions";

  const mapsBtn = document.createElement("a");
  mapsBtn.className = "btn btn--gold";
  mapsBtn.href = MAPS_OPEN_URL;
  mapsBtn.target = "_blank";
  mapsBtn.rel = "noreferrer";
  mapsBtn.append(iconMapPin(), document.createTextNode("Open in Maps"));

  locActions.append(mapsBtn);
  locBody.append(locHeading, locAddress, locActions);

  const iframe = document.createElement("iframe");
  iframe.className = "map-frame";
  iframe.title = "Google Map";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.src = MAPS_EMBED_URL;

  locationCard.append(locBody, iframe);

  /* Right — Contact card */
  const contactCard = document.createElement("article");
  contactCard.className = "card";
  contactCard.id = "contact";
  contactCard.setAttribute("aria-label", "Contact us");

  const conBody = document.createElement("div");
  conBody.className = "card__body";

  const conHeading = document.createElement("h3");
  conHeading.className = "heading-3";
  conHeading.textContent = "Contact Us";

  const conSub = document.createElement("p");
  conSub.className = "body-text";
  conSub.style.marginTop = "8px";
  conSub.style.fontSize = "15px";
  conSub.textContent = "For any assistance, call or WhatsApp us.";

  const list = document.createElement("div");
  list.className = "contact-list";
  list.style.marginTop = "16px";
  CONTACTS.forEach((c) => list.append(ContactCard(c)));

  conBody.append(conHeading, conSub, list);
  contactCard.append(conBody);

  grid.append(locationCard, contactCard);
  section.append(header, grid);

  return section;
}
