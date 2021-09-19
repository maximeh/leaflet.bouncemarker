import "leaflet";

declare module "leaflet" {
  export type BounceOptions = {
    duration?: number;
    height?: number;
    loop?: number;
  };

  export interface MarkerOptions {
    bounceOnAdd?: boolean;
    bounceOnAddOptions?: BounceOptions;
    bounceOnAddCallback?: () => void;
  }

  export interface Marker {
    bounce(callback?: () => void): void;
    bounce(options: BounceOptions, callback?: () => void): void;
    stopBounce(): void;
  }
}
