import { Component, type ReactNode } from "react";
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from "shaders/react";

/**
 * Guards the WebGL shader tree: if the renderer ever throws (no WebGL, context
 * loss, etc.) we fall back to a static gradient instead of crashing the page.
 */
class ShaderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 72% 18%, rgba(255,95,3,0.14), transparent 46%), radial-gradient(110% 110% at 18% 85%, rgba(240,240,240,0.95), #efefef 62%)",
          }}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Full-screen animated shader stack for the hero.
 * Nesting = post-process order: Swirl (base) → ChromaFlow blend →
 * FlutedGlass refraction → FilmGrain on top.
 */
export default function ShaderBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <ShaderBoundary>
        <Shader disableTelemetry style={{ width: "100%", height: "100%" }}>
          <FilmGrain strength={0.05}>
            <FlutedGlass
              aberration={0.61}
              angle={31}
              frequency={8}
              highlight={0.12}
              highlightSoftness={0}
              lightAngle={-90}
              refraction={4}
              shape="rounded"
              softness={1}
              speed={0.15}
            >
              <ChromaFlow
                baseColor="#ffffff"
                downColor="#ff5f03"
                leftColor="#ff5f03"
                rightColor="#ff5f03"
                upColor="#ff5f03"
                momentum={13}
                radius={3.5}
              >
                <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
              </ChromaFlow>
            </FlutedGlass>
          </FilmGrain>
        </Shader>
      </ShaderBoundary>
    </div>
  );
}
