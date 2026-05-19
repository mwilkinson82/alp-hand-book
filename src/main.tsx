import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initRevealOnScroll } from "./lib/revealOnScroll";

createRoot(document.getElementById("root")!).render(<App />);

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRevealOnScroll);
  } else {
    initRevealOnScroll();
  }
}
