/**
 * Sticky header — minimal, no navigation links.
 * Shows site title in elegant serif.
 */
export function Header(): HTMLElement {
  const header = document.createElement("header");
  header.className = "header";
  header.dataset.anim = "header";
  header.setAttribute("aria-label", "Site header");

  header.innerHTML = `
    <div class="container header__inner">
      <span class="header__title">BHUVANESHWARI ILLAM</span>
    </div>
  `;

  return header;
}
