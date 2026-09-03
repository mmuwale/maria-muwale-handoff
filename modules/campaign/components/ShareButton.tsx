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
      className="inline-flex items-center justify-center rounded-full border border-gold px-5 py-3.5 text-sm font-bold tracking-tight text-gold transition-colors hover:bg-gold/10"
    >
      {label}
    </button>
  );
}
