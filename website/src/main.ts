/**
 * Entry point — assembles the page from components + sections,
 * then kicks off GSAP animations.
 */
import "./style.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { Welcome } from "./sections/Welcome";
import { LocateContact } from "./sections/LocateContact";
import { initAnimations } from "./animations";

function buildApp(): void {
  const app = document.getElementById("app");
  if (!app) return;

  const main = document.createElement("main");
  main.setAttribute("aria-label", "Invitation");

  main.append(Hero(), Welcome(), LocateContact());

  app.append(Header(), main, Footer());
}

function bootstrap(): void {
  buildApp();

  // Run animations after first paint
  requestAnimationFrame(() => {
    initAnimations();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
