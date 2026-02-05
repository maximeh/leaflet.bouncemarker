/**
 * @file Plugin for Leaflet.js to make a marker bounce when added to a map.
 * @author Max Hadjinlian <max@m14n.dev>
 * @copyright 2013-2025
 * @license MIT
 * @example <caption>All examples will assume a Leaflet map object</caption>
 * import { Map, TileLayer } from 'leaflet';
 * const map = new Map('map');
 * new TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 *   attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
 * }).addTo(map);
 */

/**
 * User defined options
 * @typedef {Object} bounceOnAddOptions
 * @property {Number} [bounceOnAddOptions.duration=1000] - Animation's duration
 * in ms.
 * @property {Number} [bounceOnAddOptions.height=topY] - Height (in pixel) from
 * which the marker is "dropped".
 * @property {Number} [bounceOnAddOptions.loop=1] - Number of times the
 * animation should play. -1 is a special value for infinite loop.
 */

// For Leaflet 2.0 compatibility, we need to extend the Marker class directly
// This plugin will work when loaded after Leaflet is available on window.L
(function() {
  /**
   * Initialize the bounce marker plugin.
   * Waits for Leaflet to be available on window.L
   * and then extends the Marker class with bounce functionality.
   * @private
   * @return {void}
   */
  function initBounceMarker() {
    if (!window.L) {
      setTimeout(initBounceMarker, 100);
      return;
    }

    const L = window.L;

    const Marker = L.Marker;
    const LatLng = L.LatLng;
    const Point = L.Point;

    if (!Marker) {
      console.error(
          'Leaflet Marker class not found.',
          'Make sure Leaflet is loaded before this plugin.',
      );
      return;
    }

    injectBounceStyles();

    const originalOnAdd = Marker.prototype.onAdd;
    const originalOnRemove = Marker.prototype.onRemove;

  /**
   * Inject CSS styles for bounce animations into document head.
   * Only injects once even if called multiple times.
   * @private
   * @return {void}
   */
  function injectBounceStyles() {
    if (document.getElementById('leaflet-bouncemarker-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'leaflet-bouncemarker-styles';
    style.textContent = `
/* Bounce animation keyframes */
@keyframes leaflet-marker-bounce {
  0.00% { transform: translate3d(0, calc(var(--bounce-height) * -1.0000), 0); }
  10.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.9244), 0); }
  20.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.6975), 0); }
  30.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.3194), 0); }
  36.36% { transform: translate3d(0, calc(var(--bounce-height) * -0.0002), 0); }
  40.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0900), 0); }
  50.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.2344), 0); }
  60.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.2275), 0); }
  70.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0694), 0); }
  72.72% { transform: translate3d(0, calc(var(--bounce-height) * -0.0002), 0); }
  80.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0600), 0); }
  85.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0548), 0); }
  90.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0119), 0); }
  90.90% { transform: translate3d(0, calc(var(--bounce-height) * -0.0001), 0); }
  95.00% { transform: translate3d(0, calc(var(--bounce-height) * -0.0155), 0); }
  100.00% { transform: translate3d(0, 0, 0); }
}

/* Shadow animation keyframes - scale/opacity follows bounce curve */
@keyframes leaflet-marker-shadow-scale {
  0.00% { transform: scale(0.30); opacity: 0.20; }
  10.00% { transform: scale(0.35); opacity: 0.25; }
  20.00% { transform: scale(0.51); opacity: 0.41; }
  30.00% { transform: scale(0.78); opacity: 0.68; }
  36.36% { transform: scale(1.00); opacity: 0.90; }
  40.00% { transform: scale(0.94); opacity: 0.84; }
  50.00% { transform: scale(0.84); opacity: 0.74; }
  60.00% { transform: scale(0.84); opacity: 0.74; }
  70.00% { transform: scale(0.95); opacity: 0.85; }
  72.72% { transform: scale(1.00); opacity: 0.90; }
  80.00% { transform: scale(0.96); opacity: 0.86; }
  85.00% { transform: scale(0.96); opacity: 0.86; }
  90.00% { transform: scale(0.99); opacity: 0.89; }
  90.90% { transform: scale(1.00); opacity: 0.90; }
  95.00% { transform: scale(0.99); opacity: 0.89; }
  100.00% { transform: scale(1.00); opacity: 0.90; }
}

/* Shadow slide animation - follows marker height curve (not linear!) */
@keyframes leaflet-marker-shadow-slide {
  0.00% { transform: translate(calc(var(--bounce-height) * 1.0000 * 0.48), calc(var(--bounce-height) * 1.0000 * -1.64)); }
  10.00% { transform: translate(calc(var(--bounce-height) * 0.9244 * 0.48), calc(var(--bounce-height) * 0.9244 * -1.64)); }
  20.00% { transform: translate(calc(var(--bounce-height) * 0.6975 * 0.48), calc(var(--bounce-height) * 0.6975 * -1.64)); }
  30.00% { transform: translate(calc(var(--bounce-height) * 0.3194 * 0.48), calc(var(--bounce-height) * 0.3194 * -1.64)); }
  36.36% { transform: translate(calc(var(--bounce-height) * 0.0002 * 0.48), calc(var(--bounce-height) * 0.0002 * -1.64)); }
  40.00% { transform: translate(calc(var(--bounce-height) * 0.0900 * 0.48), calc(var(--bounce-height) * 0.0900 * -1.64)); }
  50.00% { transform: translate(calc(var(--bounce-height) * 0.2344 * 0.48), calc(var(--bounce-height) * 0.2344 * -1.64)); }
  60.00% { transform: translate(calc(var(--bounce-height) * 0.2275 * 0.48), calc(var(--bounce-height) * 0.2275 * -1.64)); }
  70.00% { transform: translate(calc(var(--bounce-height) * 0.0694 * 0.48), calc(var(--bounce-height) * 0.0694 * -1.64)); }
  72.72% { transform: translate(calc(var(--bounce-height) * 0.0002 * 0.48), calc(var(--bounce-height) * 0.0002 * -1.64)); }
  80.00% { transform: translate(calc(var(--bounce-height) * 0.0600 * 0.48), calc(var(--bounce-height) * 0.0600 * -1.64)); }
  85.00% { transform: translate(calc(var(--bounce-height) * 0.0548 * 0.48), calc(var(--bounce-height) * 0.0548 * -1.64)); }
  90.00% { transform: translate(calc(var(--bounce-height) * 0.0119 * 0.48), calc(var(--bounce-height) * 0.0119 * -1.64)); }
  90.90% { transform: translate(calc(var(--bounce-height) * 0.0001 * 0.48), calc(var(--bounce-height) * 0.0001 * -1.64)); }
  95.00% { transform: translate(calc(var(--bounce-height) * 0.0155 * 0.48), calc(var(--bounce-height) * 0.0155 * -1.64)); }
  100.00% { transform: translate(calc(var(--bounce-height) * 0.0000 * 0.48), calc(var(--bounce-height) * 0.0000 * -1.64)); }
}

/* Bounce container wrapping icon and shadow */
.leaflet-marker-bounce-container {
  position: absolute;
}

.leaflet-marker-shadow-position-container {
  position: absolute;
}

.leaflet-marker-shadow-scale-container {
  position: absolute;
}

.leaflet-marker-shadow-slide-container {
  position: absolute;
}

/* Scale/opacity animation on shadow middle wrapper */
.leaflet-marker-shadow-scale-container.leaflet-marker-shadow-scale-bouncing {
  transform-origin: top right;
  animation: leaflet-marker-shadow-scale var(--bounce-duration) linear;
  animation-delay: var(--bounce-delay, 0ms);
  animation-iteration-count: var(--bounce-loops, 1);
  animation-fill-mode: both;
}

/* Slide animation on shadow inner wrapper - follows marker height */
.leaflet-marker-shadow-slide-container.leaflet-marker-shadow-slide-bouncing {
  animation: leaflet-marker-shadow-slide var(--bounce-duration) linear;
  animation-delay: var(--bounce-delay, 0ms);
  animation-iteration-count: var(--bounce-loops, 1);
  animation-fill-mode: both;
}

/* Bouncing marker icon */
.leaflet-marker-icon.leaflet-marker-bouncing {
  animation: leaflet-marker-bounce var(--bounce-duration) ease-out;
  animation-delay: var(--bounce-delay, 0ms);
  animation-iteration-count: var(--bounce-loops, 1);
  animation-fill-mode: both;
}
`;
    document.head.appendChild(style);
  }

    /**
     * @namespace Marker
     * @property {boolean} [bounceOnAdd=false] - bounce when added to the map.
     * @property {bounceOnAddOptions} bounceOnAddOptions - user defined options
     * @property {?bounceOnAddCallback} bounceOnAddCallback - run at the end of
     * the animation
     * @example
     * new Marker([48.85, 2.35],
     * {
     *   bounceOnAdd: true,
     *   bounceOnAddOptions: {duration: 500, height: 100, loop: 2},
     *   bounceOnAddCallback: function() {console.log("done");}
     * }).addTo(map);
     */

    // Extend Marker options
    Marker.mergeOptions({
      bounceOnAdd: false,
      bounceOnAddOptions: {
        duration: 1000,
        height: -1,
        loop: 1,
      },
      /**
       * Callback run at the end of the whole animation.
       * @callback bounceOnAddCallback
       * @return {void}
       */
      bounceOnAddCallback: function() {},
    });

    // Extend Marker prototype
    Object.assign(Marker.prototype, {
      /**
       * Start CSS-based bounce animation.
       * @private
       * @param {bounceOnAddOptions} opts - user defined options
       * @param {?bounceOnAddCallback} callback - user defined callback
       */
      _startCSSBounce: function(opts, callback) {
        const icon = this._icon;
        if (!icon) return;

        const height = this._getDropHeight(opts.height);

        icon.style.setProperty('--bounce-height', height + 'px');
        icon.style.setProperty('--bounce-duration', (opts.duration || 1000) + 'ms');
        icon.style.setProperty('--bounce-delay', (opts.delay || 0) + 'ms');
        icon.style.setProperty('--bounce-loops', opts.loop || 1);

        if (!icon.classList || !icon.classList.contains('leaflet-marker-bounce-container')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'leaflet-marker-bounce-container';
          wrapper.style.position = 'absolute';
          wrapper.style.transform = icon.style.transform;
          wrapper.style.zIndex = icon.style.zIndex;

          icon.parentNode.replaceChild(wrapper, icon);
          wrapper.appendChild(icon);

          icon.style.transform = '';

          this._iconElement = icon;
          this._icon = wrapper;
          this._bounceContainer = wrapper;
        } else {
          this._iconElement = icon.querySelector('.leaflet-marker-icon');
        }

        if (this._shadow) {
          const actualShadow = this._shadowElement || this._shadow;

          let shadowContainer = actualShadow.parentNode;

          if (!shadowContainer.classList || !shadowContainer.classList.contains('leaflet-marker-shadow-scale-container')) {
            const scaleWrapper = document.createElement('div');
            scaleWrapper.className = 'leaflet-marker-shadow-scale-container';
            scaleWrapper.style.position = 'absolute';
            scaleWrapper.style.transformOrigin = 'top right';

            actualShadow.parentNode.replaceChild(scaleWrapper, actualShadow);
            scaleWrapper.appendChild(actualShadow);

            shadowContainer = scaleWrapper;
            this._shadowScaleContainer = scaleWrapper;
          } else {
            this._shadowScaleContainer = shadowContainer;
          }

          let slideContainer = shadowContainer.parentNode;
          if (!slideContainer.classList || !slideContainer.classList.contains('leaflet-marker-shadow-slide-container')) {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'leaflet-marker-shadow-slide-container';
            slideWrapper.style.position = 'absolute';

            shadowContainer.parentNode.replaceChild(slideWrapper, shadowContainer);
            slideWrapper.appendChild(shadowContainer);

            slideContainer = slideWrapper;
            this._shadowSlideContainer = slideWrapper;
          } else {
            this._shadowSlideContainer = slideContainer;
          }

          let positionContainer = slideContainer.parentNode;
          if (!positionContainer.classList || !positionContainer.classList.contains('leaflet-marker-shadow-position-container')) {
            const posWrapper = document.createElement('div');
            posWrapper.className = 'leaflet-marker-shadow-position-container';
            posWrapper.style.position = 'absolute';
            posWrapper.style.transform = actualShadow.style.transform;

            slideContainer.parentNode.replaceChild(posWrapper, slideContainer);
            posWrapper.appendChild(slideContainer);

            actualShadow.style.transform = '';

            this._shadowPositionContainer = posWrapper;
          } else {
            this._shadowPositionContainer = positionContainer;
          }

          this._shadowElement = actualShadow;
          this._shadow = this._shadowPositionContainer;

          const duration = (opts.duration || 1000) + 'ms';
          const delay = (opts.delay || 0) + 'ms';
          const loops = opts.loop || 1;

          this._shadowSlideContainer.style.setProperty('--bounce-duration', duration);
          this._shadowSlideContainer.style.setProperty('--bounce-delay', delay);
          this._shadowSlideContainer.style.setProperty('--bounce-loops', loops);
          this._shadowSlideContainer.style.setProperty('--bounce-height', height + 'px');
          this._shadowSlideContainer.classList.add('leaflet-marker-shadow-slide-bouncing');

          this._shadowScaleContainer.style.setProperty('--bounce-duration', duration);
          this._shadowScaleContainer.style.setProperty('--bounce-delay', delay);
          this._shadowScaleContainer.style.setProperty('--bounce-loops', loops);
          this._shadowScaleContainer.classList.add('leaflet-marker-shadow-scale-bouncing');
        }

        const iconElement = this._iconElement || icon;
        iconElement.classList.add('leaflet-marker-bouncing');

        if (this._map) {
          this.update();
        }

        this._bounceCallback = callback;

        const duration = opts.duration || 1000;
        const delay = opts.delay || 0;
        const loops = opts.loop || 1;
        const totalDuration = duration * loops + delay;

        this._bounceTimeoutId = setTimeout(() => {
          this._endCSSBounce();
        }, totalDuration);
      },

      /**
       * End CSS-based bounce animation and cleanup.
       * @private
       */
      _endCSSBounce: function() {
        const iconElement = this._iconElement || this._icon;
        if (iconElement) {
          iconElement.classList.remove('leaflet-marker-bouncing');
          iconElement.style.removeProperty('--bounce-height');
          iconElement.style.removeProperty('--bounce-duration');
          iconElement.style.removeProperty('--bounce-delay');
          iconElement.style.removeProperty('--bounce-loops');
        }

        if (this._shadowScaleContainer) {
          this._shadowScaleContainer.classList.remove('leaflet-marker-shadow-scale-bouncing');
          this._shadowScaleContainer.style.removeProperty('--bounce-duration');
          this._shadowScaleContainer.style.removeProperty('--bounce-delay');
          this._shadowScaleContainer.style.removeProperty('--bounce-loops');
        }

        if (this._shadowSlideContainer) {
          this._shadowSlideContainer.classList.remove('leaflet-marker-shadow-slide-bouncing');
          this._shadowSlideContainer.style.removeProperty('--bounce-duration');
          this._shadowSlideContainer.style.removeProperty('--bounce-delay');
          this._shadowSlideContainer.style.removeProperty('--bounce-loops');
          this._shadowSlideContainer.style.removeProperty('--bounce-height');
        }

        if (this._bounceTimeoutId) {
          clearTimeout(this._bounceTimeoutId);
          this._bounceTimeoutId = null;
        }

        if (typeof this._bounceCallback === 'function') {
          this._bounceCallback();
          this._bounceCallback = null;
        }
      },

      /**
       * Calculate drop height from options.
       * @private
       * @param {Number} [height=-1] - Height option
       * @return {Number} Height in pixels
       */
      _getDropHeight: function(height) {
        if (height === undefined || height < 0) {
          const mapHeight = this._map.getSize().y;
          return mapHeight / 2;
        }
        return height;
      },

      /**
       * Make a marker bounce at anytime you wish.
       * @param {bounceOnAddOptions} options - user defined options
       * @param {?bounceOnAddCallback} endCallback - run at end of animation
       * @example
       * marker = new Marker([48.85, 2.35], {bounceOnAdd: true}).addTo(map);
       * marker.on('click', function() {
       *     marker.bounce({duration: 500, height: 100});
       * });
       */
      bounce: function(options, endCallback) {
        if (typeof options === 'function') {
          endCallback = options;
          options = null;
        }
        options = options || {duration: 1000, height: -1, loop: 1};

        this._startCSSBounce(options, endCallback);
      },

      /**
       * Stop the animation and place the marker at its destination.
       * @return {void}
       */
      stopBounce: function() {
        this._endCSSBounce();
      },

      /**
       * Add a Marker to {map} and optionaly make it bounce.
       * @override
       * @param {Map} map - Leaflet map to add the marker to
       * @example
       * new Marker([48.85, 2.35],
       *   {
       *     bounceOnAdd: true,
       *   }).addTo(map);
       */
      onAdd: function(map) {
        this._map = map;

        originalOnAdd.call(this, map);

        if (this.options.bounceOnAdd === true) {
          this.bounce(
              this.options.bounceOnAddOptions,
              this.options.bounceOnAddCallback,
          );
        }
      },

      /**
       * Stop any animation running and remove the Marker from {map}.
       * @override
       * @param {Map} map - Leaflet map to add the marker to
       */
      onRemove: function(map) {
        this.stopBounce();
        originalOnRemove.call(this, map);
      },
    });
  }

  initBounceMarker();
})();
