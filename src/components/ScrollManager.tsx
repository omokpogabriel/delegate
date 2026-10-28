import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to #anchors (opening a week if it's collapsed) or to the top on page change. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      if (el instanceof HTMLDetailsElement) el.open = true;
      el.scrollIntoView({ block: "start" });
      return true;
    };
    if (!go()) requestAnimationFrame(() => go());
  }, [pathname, hash]);
  return null;
}
