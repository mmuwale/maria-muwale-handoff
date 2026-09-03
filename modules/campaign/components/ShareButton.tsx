"use client";

/** Uses the Web Share API when present, falls back to copying the URL. */
export function ShareButton({ label }: { label: string }) {
  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // user cancelled - fall through to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full border-2 border-gold px-3.5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10 min-[900px]:px-4 min-[900px]:py-4 min-[900px]:text-[13px]"
    >
      {label}
    </button>
  );
}
