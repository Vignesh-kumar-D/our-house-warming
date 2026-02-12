/**
 * GSAP + ScrollTrigger animations.
 * All scroll-triggered animations replay every time the section enters the viewport.
 * All animations respect prefers-reduced-motion.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function initAnimations(): void {
  if (prefersReducedMotion()) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Header entrance ── */
  gsap.from("[data-anim='header']", {
    y: -16,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
  });

  /* ── Hero: content fade + scale (cascading children) ── */
  const heroContent = document.querySelector("[data-anim='hero-content']");
  if (heroContent) {
    gsap.from(heroContent.children, {
      opacity: 0,
      y: 30,
      scale: 0.97,
      duration: 0.9,
      delay: 0.15,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  /* ── Hero: background zoom-in on load ── */
  gsap.to("[data-anim='hero-bg']", {
    scale: 1,
    duration: 2.4,
    ease: "power2.out",
  });

  /* ── Hero: parallax on scroll ── */
  gsap.to("[data-anim='hero-bg']", {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: "[data-section='hero']",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  /* ── Hero divider: golden shimmer ── */
  gsap.fromTo(
    ".hero__divider",
    { opacity: 0 },
    { opacity: 1, duration: 1.2, delay: 0.8, ease: "power2.inOut" },
  );

  /* ── Welcome: text slides up with stagger ── */
  gsap.from("[data-anim='welcome']", {
    opacity: 0,
    y: 36,
    duration: 1,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: "[data-section='welcome']",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  /* ── Section header: slide up ── */
  gsap.from("[data-anim='section-header']", {
    opacity: 0,
    y: 24,
    duration: 0.85,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "[data-section='locate-contact']",
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
  });

  /* ── Location card: slide in from left ── */
  gsap.from("[data-anim='location-card']", {
    opacity: 0,
    x: -30,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "[data-section='locate-contact']",
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  /* ── Contact cards: stagger reveal from right ── */
  gsap.from("[data-anim='contact-card']", {
    opacity: 0,
    x: 30,
    duration: 0.85,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: "[data-section='locate-contact']",
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  /* ── Footer: fade in + slide up (stays visible once triggered) ── */
  gsap.from("[data-anim='footer']", {
    opacity: 0,
    y: 18,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "[data-section='footer']",
      start: "top 98%",
      toggleActions: "play none none none",
    },
  });
}
