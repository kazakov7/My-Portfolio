import { useEffect, useRef } from "react";

// Helper to get or generate anonymous visitor ID (vid)
export function getVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("vid");
    if (!vid) {
      vid =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "v_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem("vid", vid);
    }
    return vid;
  } catch {
    return "";
  }
}

// Helper to parse UTM query parameters
function getUtm() {
  if (typeof window === "undefined") return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    const s = sp.get("utm_source");
    const m = sp.get("utm_medium");
    const c = sp.get("utm_campaign");
    if (!s && !m && !c) return null;
    const parts = [];
    if (s) parts.push(`source=${s}`);
    if (m) parts.push(`medium=${m}`);
    if (c) parts.push(`campaign=${c}`);
    return parts.join("&");
  } catch {
    return null;
  }
}

// Helper to get timezone
function getTimezone() {
  if (typeof window === "undefined") return "";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

// Core send function: POSTs analytics event to /api/track using navigator.sendBeacon
export function send(type, extra = {}) {
  if (typeof window === "undefined") return;

  // If noTrack flag is set (e.g. site owner / admin), do not send anything
  try {
    if (localStorage.getItem("noTrack")) return;
  } catch {
    return;
  }

  const vid = getVisitorId();
  if (!vid) return;

  const payload = {
    vid,
    type,
    path: window.location.pathname + (window.location.search || "") + (window.location.hash || ""),
    referrer: document.referrer || "",
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
    lang: navigator.language || "",
    tz: getTimezone(),
    utm: getUtm(),
    target: extra.target || null,
    seconds: typeof extra.seconds === "number" ? Math.round(extra.seconds) : null,
    scroll: typeof extra.scroll === "number" ? Math.round(extra.scroll) : null,
  };

  const data = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([data], { type: "application/json" });
    const success = navigator.sendBeacon("/api/track", blob);
    if (!success) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
      keepalive: true,
    }).catch(() => {});
  }
}

// useTracker React hook
export function useTracker() {
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const lastPathRef = useRef("");

  useEffect(() => {
    // 1. Send pageview on initial load or route change
    const triggerPageview = () => {
      const currentPath = window.location.pathname + (window.location.search || "");
      if (currentPath !== lastPathRef.current) {
        lastPathRef.current = currentPath;
        startTimeRef.current = Date.now();
        maxScrollRef.current = 0;
        send("pageview", { seconds: 0, scroll: 0 });
      }
    };

    triggerPageview();

    // Listen to history / route changes
    const onPopState = () => triggerPageview();
    const onHashChange = () => triggerPageview();
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);

    // Monkey-patch pushState and replaceState to catch client-side routing changes
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      triggerPageview();
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      triggerPageview();
    };

    // 2. Track maximum scroll percentage
    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = h.scrollTop || b.scrollTop;
      const sh = h.scrollHeight || b.scrollHeight;
      const ch = h.clientHeight;
      const scrollable = sh - ch;
      const pct = scrollable <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((st / scrollable) * 100)));
      if (pct > maxScrollRef.current) {
        maxScrollRef.current = pct;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 3. Track leave event on visibilitychange (hidden) and pagehide
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        const seconds = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
        send("leave", { seconds, scroll: maxScrollRef.current });
      }
    };

    const handlePageHide = () => {
      const seconds = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
      send("leave", { seconds, scroll: maxScrollRef.current });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);

    // 4. Track clicks on any element with data-track="name"
    const handleClick = (e) => {
      const targetEl = e.target.closest("[data-track]");
      if (!targetEl) return;
      const targetName = targetEl.getAttribute("data-track");
      if (targetName) {
        const seconds = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
        send("click", {
          target: targetName,
          seconds,
          scroll: maxScrollRef.current,
        });
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("click", handleClick, { capture: true });
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
}

export default useTracker;
