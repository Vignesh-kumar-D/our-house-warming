const CONFIG = {
  addressLines: [
    "YOUR HOUSE NAME / FLAT NO",
    "Street, Area",
    "City, State PINCODE",
  ],

  // If you have a custom embed iframe URL, paste it here.
  // Example: Google Maps "Share" → "Embed a map" → copy the src URL.
  mapEmbedSrc: "",

  // Shown in the popup. Replace with your own YouTube IDs or MP4 paths.
  videos: [
    { title: "House tour", kind: "youtube", youtubeId: "dQw4w9WgXcQ" },
    { title: "Before / After", kind: "youtube", youtubeId: "M7lc1UVf-VE" },
  ],
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) node.append(child);
  return node;
}

function buildMapsSearchUrl(addressText) {
  const q = encodeURIComponent(addressText);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function bestEffortEmbedUrl(addressText) {
  // NOTE: Google may block some non-embed URLs in iframes. This is a best-effort default.
  const q = encodeURIComponent(addressText);
  return `https://www.google.com/maps?output=embed&q=${q}`;
}

function setStatus(text) {
  const node = $("#statusPill");
  if (!node) return;
  node.textContent = text;
  node.hidden = !text;
  if (text) {
    window.clearTimeout(setStatus._t);
    setStatus._t = window.setTimeout(() => (node.hidden = true), 2400);
  }
}

function setupLocation() {
  const addressText = CONFIG.addressLines.filter(Boolean).join(", ");

  $("#address").textContent = CONFIG.addressLines.filter(Boolean).join("\n");
  $("#openMaps").href = buildMapsSearchUrl(addressText);

  $("#copyAddress").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(addressText);
      setStatus("Copied address");
    } catch {
      setStatus("Copy failed (try manually)");
    }
  });

  const iframe = $("#mapFrame");
  const fallback = $("#mapFallback");
  const embedSrc = (CONFIG.mapEmbedSrc || bestEffortEmbedUrl(addressText)).trim();
  iframe.src = embedSrc;

  // If the iframe errors, we show a simple fallback note.
  iframe.addEventListener("error", () => {
    fallback.style.display = "block";
  });
}

function setupModal() {
  const root = $("#modalRoot");
  const overlay = $("#modalOverlay");
  const dialog = $("#modalDialog");
  const btnOpen = $("#openVideos");
  const btnClose = $("#closeModal");
  const btnPrev = $("#prevVideo");
  const btnNext = $("#nextVideo");
  const title = $("#modalTitle");
  const player = $("#player");
  const counter = $("#counter");

  let index = 0;
  let lastActive = null;

  const focusablesSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function render() {
    const total = CONFIG.videos.length;
    const item = CONFIG.videos[index];
    title.textContent = item?.title || "Videos";
    counter.textContent = total ? `${index + 1} / ${total}` : "0 / 0";

    // Clear old player to stop playback.
    player.replaceChildren();

    if (!item) {
      player.append(el("div", { class: "card__body", text: "No videos configured." }));
      return;
    }

    if (item.kind === "youtube") {
      const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
        item.youtubeId,
      )}?autoplay=1&rel=0`;
      player.append(
        el("iframe", {
          src,
          title: item.title || "Video",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: "true",
        }),
      );
      return;
    }

    if (item.kind === "mp4") {
      const video = el("video", { controls: "true", playsinline: "true" });
      video.src = item.src;
      video.autoplay = true;
      player.append(video);
      return;
    }

    player.append(el("div", { class: "card__body", text: "Unsupported video type." }));
  }

  function openAt(i = 0) {
    if (!CONFIG.videos.length) return;
    lastActive = document.activeElement;
    index = Math.max(0, Math.min(CONFIG.videos.length - 1, i));
    root.dataset.open = "true";
    render();
    btnClose.focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    root.dataset.open = "false";
    player.replaceChildren(); // stop playback
    document.body.style.overflow = "";
    if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
  }

  function prev() {
    if (!CONFIG.videos.length) return;
    index = (index - 1 + CONFIG.videos.length) % CONFIG.videos.length;
    render();
  }

  function next() {
    if (!CONFIG.videos.length) return;
    index = (index + 1) % CONFIG.videos.length;
    render();
  }

  function trapTab(e) {
    if (root.dataset.open !== "true") return;
    if (e.key !== "Tab") return;

    const focusables = Array.from(dialog.querySelectorAll(focusablesSelector)).filter(
      (n) => !n.hasAttribute("disabled") && n.getAttribute("aria-hidden") !== "true",
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  btnOpen.addEventListener("click", () => openAt(0));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (root.dataset.open !== "true") return;
    if (e.key === "Escape") close();
    trapTab(e);
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // If user clicks inside modal, don't close.
  dialog.addEventListener("click", (e) => e.stopPropagation());
}

function main() {
  setupLocation();
  setupModal();
}

document.addEventListener("DOMContentLoaded", main);
