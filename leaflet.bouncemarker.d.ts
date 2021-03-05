import * as L from 'leaflet';

declare module 'leaflet' {

  export interface MarkerOptions extends InteractiveLayerOptions {

    bounceOnAdd?: boolean;

    bounceOnAddOptions?: {
        duration: number,
        height: number,
        loop: number,
    };

    bounceOnAddCallback?: Function;

  }

}
