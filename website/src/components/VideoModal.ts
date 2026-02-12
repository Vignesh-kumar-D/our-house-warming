/**
 * Video modal — carousel of YouTube / mp4 videos in a dialog overlay.
 * Supports keyboard navigation (←/→ arrows, Escape).
 */

export interface VideoItem {
  title: string;
  kind: "youtube" | "mp4";
  youtubeId?: string;
  src?: string;
}

export interface VideoModalInstance {
  root: HTMLElement;
  openAt: (index?: number) => void;
  close: () => void;
}

function el(
  tag: string,
  attrs: Record<string, string> = {},
  children: HTMLElement[] = [],
): HTMLElement {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) node.append(child);
  return node;
}

export function VideoModal({ videos = [] as VideoItem[] }): VideoModalInstance {
  const root = el("div", { class: "modalRoot", "data-open": "false", "aria-hidden": "true" });
  const overlay = el("div", { class: "modalOverlay", "aria-hidden": "true" });

  const dialog = el("section", {
    class: "modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Videos",
  });

  const title = el("h3", { class: "modalTitle", text: "Videos" });
  const counter = el("span", { class: "counter", text: "0 / 0" });
  const playerWrap = el("div", { class: "modalBody" });

  const playerHost = el("div", { class: "card" }, [
    el("iframe", { class: "player", title: "Video player", src: "" }),
  ]);
  playerWrap.append(playerHost);

  const btnClose = el("button", { class: "btn", type: "button", text: "Close" });
  const btnPrev = el("button", { class: "btn", type: "button", text: "Prev" });
  const btnNext = el("button", { class: "btn btn--primary", type: "button", text: "Next" });

  const header = el("header", { class: "modalHeader" }, [
    title,
    el("div", { class: "spacer" }),
    btnClose,
  ]);
  const footer = el("footer", { class: "modalFooter" }, [
    btnPrev,
    btnNext,
    counter,
    el("span", { class: "hint", text: "Tip: ← → keys • ESC to close" }),
  ]);

  dialog.append(header, playerWrap, footer);
  root.append(overlay, dialog);

  const iframe = playerHost.querySelector("iframe") as HTMLIFrameElement;
  let index = 0;
  let lastActive: Element | null = null;

  function setOpen(open: boolean): void {
    root.dataset.open = open ? "true" : "false";
    root.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }

  function stop(): void {
    iframe.src = "";
  }

  function render(): void {
    const total = videos.length;
    const item = videos[index];
    title.textContent = item?.title || "Videos";
    counter.textContent = total ? `${index + 1} / ${total}` : "0 / 0";

    stop();
    if (!item) return;

    if (item.kind === "youtube" && item.youtubeId) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
        item.youtubeId,
      )}?autoplay=1&rel=0`;
    } else if (item.kind === "mp4" && item.src) {
      iframe.src = item.src;
    }
  }

  function openAt(i = 0): void {
    if (!videos.length) return;
    lastActive = document.activeElement;
    index = Math.max(0, Math.min(videos.length - 1, i));
    setOpen(true);
    render();
    (btnClose as HTMLButtonElement).focus();
  }

  function close(): void {
    setOpen(false);
    stop();
    if (lastActive && "focus" in lastActive) (lastActive as HTMLElement).focus();
  }

  function prev(): void {
    if (!videos.length) return;
    index = (index - 1 + videos.length) % videos.length;
    render();
  }

  function next(): void {
    if (!videos.length) return;
    index = (index + 1) % videos.length;
    render();
  }

  overlay.addEventListener("click", close);
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  dialog.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("keydown", (e) => {
    if (root.dataset.open !== "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  return { root, openAt, close };
}
