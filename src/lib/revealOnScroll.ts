/**
 * Global reveal-on-scroll initializer.
 * Observes any element with [data-reveal] and toggles .is-visible.
 * Picks up dynamically added nodes via MutationObserver.
 */
let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;

const observeAll = (root: ParentNode = document) => {
  if (!io) return;
  root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) => {
    io!.observe(el);
  });
};

export const initRevealOnScroll = () => {
  if (typeof window === "undefined" || io) return;

  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => el.classList.add("is-visible"));
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io!.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  observeAll();

  mo = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const el = node as HTMLElement;
        if (el.matches?.("[data-reveal]")) io!.observe(el);
        observeAll(el);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
};
