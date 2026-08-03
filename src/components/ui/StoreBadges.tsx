import { appMeta } from "@/lib/site";

/* ============================================================================
   Google Play + Apple App Store download badges for Accord Interact. Shared by
   the /app page hero/CTA and the home-page download band.
   ========================================================================== */

/** The Google Play "triangle" glyph in its brand colours, drawn inline. */
function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path fill="#00D3FF" d="M47 24c-6 4-10 11-10 20v424c0 9 4 16 10 20l236-232L47 24z" />
      <path fill="#00F076" d="M47 24c4-3 10-3 16 1l318 181-72 71L47 24z" />
      <path fill="#FFCE00" d="M381 206l73 42c16 9 16 27 0 36l-73 42-72-80 72-80z" />
      <path fill="#FF3A44" d="M309 286l72 71-318 181c-6 4-12 4-16 1l262-253z" />
    </svg>
  );
}

/** Apple logo glyph. */
function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" className={className} fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

const BADGE =
  "group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

/** "Get it on Google Play" badge → the Play Store listing. */
export function PlayBadge() {
  return (
    <a
      href={appMeta.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get ${appMeta.name} on Google Play`}
      className={BADGE}
    >
      <PlayGlyph className="h-7 w-7 shrink-0" />
      <span className="text-left leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-steel-400">
          Get it on
        </span>
        <span className="block font-display text-lg font-semibold text-white">
          Google Play
        </span>
      </span>
    </a>
  );
}

/** "Download on the App Store" badge → the Apple App Store listing. */
export function AppStoreBadge() {
  return (
    <a
      href={appMeta.appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${appMeta.name} on the App Store`}
      className={BADGE}
    >
      <AppleGlyph className="h-7 w-7 shrink-0 text-white" />
      <span className="text-left leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-steel-400">
          Download on the
        </span>
        <span className="block font-display text-lg font-semibold text-white">
          App Store
        </span>
      </span>
    </a>
  );
}

/** Both store badges, side by side. */
export default function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <PlayBadge />
      <AppStoreBadge />
    </div>
  );
}
