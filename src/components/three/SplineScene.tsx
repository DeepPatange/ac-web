"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";

/**
 * Renders the client's actual Spline port/logistics scene.
 *
 * Accepts either the local editor file (public/spline/*.spline) or a published
 * .splinecode URL. On load we hide the scene's baked-in marketing text and
 * "Learn More" button so they don't collide with our own hero copy, and the
 * `.spline-tint` wrapper recolours the scene into the Accord red/white palette.
 */
const HIDE_RE = /text|instruction|leadboard|learn|button|cta|title|label/i;

/* The scene is a full-viewport WebGL canvas; on a retina display it would
   otherwise render at 2× device-pixel-ratio and then get a CSS tint filter
   composited on top every frame — the cause of the scroll lag. We size the
   canvas to RENDER_SCALE of the viewport and upscale it with a CSS transform,
   so fragment work drops to ~RENDER_SCALE² (0.7² ≈ 49%), roughly halving GPU
   load. The scene is stylised and red-tinted, so the upscale is imperceptible. */
const RENDER_SCALE = 0.55;

export default function SplineScene({
  scene,
  active = true,
}: {
  scene: string;
  active?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const appRef = useRef<Application | null>(null);

  const onLoad = useCallback((app: Application) => {
    appRef.current = app;
    try {
      const all = app.getAllObjects();
      for (const obj of all) {
        if (obj && typeof obj.name === "string" && HIDE_RE.test(obj.name)) {
          try {
            obj.visible = false;
          } catch {
            /* some nodes don't expose visibility — ignore */
          }
        }
      }
    } catch {
      /* getAllObjects unavailable — render the scene untouched */
    }
    setReady(true);
  }, []);

  /* Pause the render loop (and controls/events) while the hero is off-screen,
     resume instantly when it returns. The scene stays mounted, so it is loaded
     only once and never re-fetched/re-initialised. */
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (active) app.play();
    else app.stop();
  }, [active, ready]);

  return (
    <div
      className={`spline-tint absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      /* Promote the tinted canvas to its own GPU compositor layer so scrolling
         it past is a cheap texture move, not a re-raster of the filtered layer. */
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      {/* Reduced-resolution render target, upscaled to fill (see RENDER_SCALE). */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: `${100 * RENDER_SCALE}%`,
          height: `${100 * RENDER_SCALE}%`,
          transform: `scale(${1 / RENDER_SCALE}) translateZ(0)`,
        }}
      >
        <Spline
          scene={scene}
          onLoad={onLoad}
          className="!absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
