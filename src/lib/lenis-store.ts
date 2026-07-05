import type Lenis from "lenis";

/**
 * Shared handle to the app-wide Lenis instance created in SmoothScroll, so
 * scroll-driven components can drive precise programmatic scrolls (e.g. snap
 * one panel per wheel gesture) instead of fighting Lenis's momentum.
 */
export const lenisStore: { current: Lenis | null } = { current: null };
