"use client";

import Link from "next/link";

/**
 * Upgrades to history.back() only when the visitor demonstrably arrived from
 * the campaign page on this origin, so it restores their scroll position but
 * can never walk someone off the site. A normal client-side navigation to
 * "/" otherwise.
 */
export function BackToCampaign() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const ref = document.referrer;
    if (!ref) return;
    try {
      const u = new URL(ref);
      if (u.origin !== location.origin) return;
      if (u.pathname !== "/" && u.pathname !== "/index.html") return;
      if (history.length < 2) return;
      e.preventDefault();
      history.back();
    } catch {
      // malformed referrer - fall through to the plain link
    }
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="border-b border-gold-d/60 pb-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-navy/70 hover:text-navy"
    >
      &larr; Back to the campaign
    </Link>
  );
}
