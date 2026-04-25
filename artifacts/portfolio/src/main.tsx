import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";

// Global scroll-triggered grey text reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
);

const observeTextReveals = () => {
  document.querySelectorAll(".text-reveal, .text-reveal-muted, .text-reveal-reference, .text-reveal-word").forEach((el) => {
    revealObserver.observe(el);
  });
};

// Observe on load + after any DOM mutations (for dynamic content)
const mutationObserver = new MutationObserver(observeTextReveals);
mutationObserver.observe(document.body, { childList: true, subtree: true });
window.addEventListener("DOMContentLoaded", observeTextReveals);

createRoot(document.getElementById("root")!).render(<App />);
