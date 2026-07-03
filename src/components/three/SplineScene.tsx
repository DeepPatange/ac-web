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
      className={`spline-tint absolute inset-0 h-full w-full transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <Spline scene={scene} onLoad={onLoad} className="!absolute inset-0 h-full w-full" />
    </div>
  );
}
