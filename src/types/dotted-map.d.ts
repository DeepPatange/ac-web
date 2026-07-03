// Minimal type declarations for `dotted-map` (the package ships no types).
declare module "dotted-map" {
  interface DottedMapOptions {
    width?: number;
    height?: number;
    countries?: string[];
    grid?: "vertical" | "diagonal";
    avoidOuterPins?: boolean;
  }

  interface GetSVGOptions {
    radius?: number;
    color?: string;
    shape?: "circle" | "hexagon";
    backgroundColor?: string;
  }

  interface PinOptions {
    lat: number;
    lng: number;
    svgOptions?: { color?: string; radius?: number };
    data?: unknown;
  }

  export default class DottedMap {
    constructor(options: DottedMapOptions);
    addPin(options: PinOptions): void;
    getPin(options: { lat: number; lng: number }): { x: number; y: number };
    getSVG(options: GetSVGOptions): string;
    image: { region: unknown; width: number; height: number };
  }
}
