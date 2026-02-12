/**
 * Section 2 — Welcome Message
 * Clean, centered, calm rhythm.
 */
export function Welcome(): HTMLElement {
  const section = document.createElement("section");
  section.className = "welcome";
  section.id = "welcome";
  section.dataset.section = "welcome";
  section.setAttribute("aria-label", "Welcome message");

  section.innerHTML = `
    <div class="container welcome__inner">
      <p class="kicker">Welcome</p>
      <h2 class="heading-2" data-anim="welcome">
        Welcome to Our Home
      </h2>
      <p class="body-text welcome__body" data-anim="welcome">
        This home marks a meaningful chapter for our family &mdash;
        a place of togetherness, gratitude, and cherished moments.
        We are happy to share this space and this joy with you.
      </p>
    </div>
  `;

  return section;
}
