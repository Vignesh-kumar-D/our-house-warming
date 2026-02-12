/**
 * Section 1 — Hero
 * Full-screen with house photo background, gradient overlay, centered content.
 */
export function Hero(): HTMLElement {
  const section = document.createElement("section");
  section.className = "hero";
  section.id = "hero";
  section.dataset.section = "hero";
  section.setAttribute("aria-label", "Hero");

  section.innerHTML = `
    <div class="hero__bg" data-anim="hero-bg" aria-hidden="true"></div>

    <div class="container hero__content" data-anim="hero-content">
      <p class="kicker hero__kicker">OM PACHAI AMMAN THUNAI !!</p>
      <h1 class="heading-1">A Home Built with Love,<br/>Faith, and New Beginnings</h1>
      <div class="hero__actions">
        <a class="btn btn--gold" href="#welcome">Welcome</a>
        <a class="btn" href="#locate">Locate Us</a>
      </div>
    </div>

    <div class="hero__divider" aria-hidden="true"></div>
  `;

  return section;
}
