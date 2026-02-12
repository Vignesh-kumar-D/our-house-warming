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
    <div class="container footer__inner" data-anim="footer">
      <p class="footer__col footer__col--left">
        Made with <span class="heart" aria-label="love">❤️</span> by <strong>Vignesh</strong>
      </p>
      <p class="footer__col footer__col--center">
        <strong>Hosted by</strong><br/>
        G Devaraj · D Bhuvaneshwari ·
        D Vignesh Kumar · D Tarun Kumar
      </p>
      <p class="footer__col footer__col--right">
        &copy; ${year} All rights reserved
      </p>
    </div>
  `;

  return footer;
}
