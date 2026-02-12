/**
 * Footer — three-column layout:
 *   Left:   "Made with love by D Vignesh Kumar"
 *   Center: "Hosted by …"
 *   Right:  "© 2026 All rights reserved"
 */
export function Footer(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.dataset.section = "footer";
  footer.setAttribute("aria-label", "Footer");

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="container footer__inner footer__inner--two" data-anim="footer">
      <p class="footer__col footer__col--left">
        Made with <span class="heart" aria-label="love">❤️</span> by <strong>D Vignesh Kumar</strong>
      </p>
      <p class="footer__col footer__col--right">
        &copy; ${year} All rights reserved
      </p>
    </div>
  `;

  return footer;
}
