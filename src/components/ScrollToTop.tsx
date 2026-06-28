import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll behavior:
 * - On pathname change: scroll to top (or to hash anchor if present).
 * - On /read: persist the reader's scroll position to sessionStorage so that
 *   tab-switching to Excel/Google and coming back, or any in-page remount,
 *   restores their place instead of snapping to the top.
 */
const STORAGE_KEY = "alp:read:scrollY";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Persist scroll position while reading.
  useEffect(() => {
    if (pathname !== "/read") return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(STORAGE_KEY, String(window.scrollY));
        } catch {
          /* ignore */
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
        window.scrollTo({ top: 0, left: 0 });
      });
      return;
    }

    // On /read, restore the saved scroll position if we have one.
    if (pathname === "/read") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        const y = saved ? parseInt(saved, 10) : 0;
        if (Number.isFinite(y) && y > 0) {
          // Wait for content to mount/layout before restoring.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: y, left: 0 });
            });
          });
          return;
        }
      } catch {
        /* ignore */
      }
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

