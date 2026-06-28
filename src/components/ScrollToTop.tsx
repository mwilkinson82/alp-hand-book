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

const isReaderMounted = () => Boolean(document.querySelector('[data-reader-content="true"]'));

const getSavedReadPosition = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const y = saved ? parseInt(saved, 10) : 0;
    return Number.isFinite(y) ? y : 0;
  } catch {
    return 0;
  }
};

const saveReadPosition = () => {
  if (!isReaderMounted()) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.round(window.scrollY))));
  } catch {
    /* ignore */
  }
};

const restoreReadPosition = () => {
  const savedY = getSavedReadPosition();
  let attempts = 0;

  const restore = () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const canRestore = savedY <= maxY || attempts >= 24;

    if (canRestore) {
      window.scrollTo({ top: Math.min(savedY, maxY), left: 0 });
      return;
    }

    attempts += 1;
    requestAnimationFrame(restore);
  };

  requestAnimationFrame(restore);
};

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
        saveReadPosition();
        ticking = false;
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveReadPosition();
        return;
      }

      if (window.scrollY <= 8) {
        restoreReadPosition();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveReadPosition);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      saveReadPosition();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveReadPosition);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
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
      restoreReadPosition();
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

