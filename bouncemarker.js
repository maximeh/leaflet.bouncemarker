/**
 * @file Plugin for Leaftlet.js to make a marker bounce when added to a map.
 * @author Max Hadjinlian <m@1234.yt>
 * @copyright 2013-2022
 * @license MIT
 * @example <caption>All examples will assume a Leaflet map object</caption>
 * const map = L.map('map');
 * L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

(function() {
  // Retain the value of the original onAdd and onRemove functions
  const originalOnAdd = L.Marker.prototype.onAdd;
  const originalOnRemove = L.Marker.prototype.onRemove;

  /**
   * @namespace L.marker
   * @property {boolean} [bounceOnAdd=false] - bounce when added to the map.
   * @property {bounceOnAddOptions} bounceOnAddOptions - user defined options
   * @property {?bounceOnAddCallback} bounceOnAddCallback - run at the end of
   * the animation
   * @example
   * L.marker([48.85, 2.35],
   * {
   *   bounceOnAdd: true,
   *   bounceOnAddOptions: {duration: 500, height: 100, loop: 2},
   *   bounceOnAddCallback: function() {console.log("done");}
   * }).addTo(map);
   */
  L.Marker.mergeOptions({
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

  L.Marker.include({

    /**
     * Helper to `latLngToContainerPoint` conversion method.
     * @private
     * @see {@link https://leafletjs.com/reference.html#map-latlngtocontainerpoint|Ref}
     * @param {L.LatLng} latlng - geographical coordinate
     * @return {L.Point} the corresponding pixel coordinate relative to the map
     * container.
     */
    _toPoint: function(latlng) {
      return this._map.latLngToContainerPoint(latlng);
    },

    /**
     * Helper to `containerPointToLatLng` conversion method.
     * @private
     * @see {@link https://leafletjs.com/reference.html#map-containerPointToLatLng|Ref}
     * @param {L.Point} point - pixel coordinate relative to the map container
     * @return {L.LatLng} the corresponding geographical coordinate (for the
     * current zoom level).
     */
    _toLatLng: function(point) {
      return this._map.containerPointToLatLng(point);
    },

    /**
     * Compute and update the marker's coordinate at every frame.
     * @private
     * @param {bounceOnAddOptions} opts - user defined options
     */
    _motionStep: function(opts) {
      const self = this;
      const timePassed = new Date() - opts.start;
      let progress = timePassed / opts.duration;

      if (progress > 1) {
        progress = 1;
      }

      const delta = self._easeOutBounce(progress);
      opts.step(delta);

      if (progress === 1) {
        opts.start = new Date();
        progress = 0;
        if (opts.loop > 0) opts.loop = opts.loop - 1;
        if (opts.loop === 0) {
          opts.end();
          return;
        }
      }

      self._animationId = L.Util.requestAnimFrame(function(timestamp) {
        self._motionStep(opts);
      });
    },

    /**
     * Wrapper around _motionStep; takes care of computing coordinates and
     * calling callback at the end.
     * @see {@link _motionStep}
     * @private
     * @param {bounceOnAddOptions} opts - user defined options
     * @param {?bounceOnAddCallback} callback - user defined callback
     */
    _bounceMotion: function(opts, callback) {
      const original = L.latLng(this._origLatlng);
      const startY = this._dropPoint.y;
      const startX = this._dropPoint.x;
      const distance = this._point.y - startY;
      const self = this;
      const map = self._map;

      self._animationId = L.Util.requestAnimFrame(function() {
        self._motionStep({
          duration: opts.duration || 1000, // 1 sec by default
          loop: opts.loop || 1,
          start: new Date(),
          step: function(delta) {
            self._dropPoint.y =
              startY +
              (distance * delta) -
              (map.project(map.getCenter()).y - self._origMapCenter.y);
            self._dropPoint.x =
              startX -
              (map.project(map.getCenter()).x - self._origMapCenter.x);
            self.setLatLng(self._toLatLng(self._dropPoint));
          },
          end: function() {
            self.setLatLng(original);
            if (typeof callback === 'function') callback();
          },
        });
      });
    },

    /**
     * Rate of change of progress over time using the easeOut function.
     * Many thanks to Robert Penner for this function
     * @see {@link https://easings.net/#easeOutBounce}
     * @private
     * @param {float } progress - current progress on the curve
     * @return {float} Next progress value
     */
    _easeOutBounce: function(progress) {
      if ((progress) < (1 / 2.75)) {
        return (7.5625 * progress * progress);
      } else if (progress < (2 / 2.75)) {
        return (7.5625 * (progress -= (1.5 / 2.75)) * progress + 0.75);
      } else if (progress < (2.5 / 2.75)) {
        return (7.5625 * (progress -= (2.25 / 2.75)) * progress + 0.9375);
      } else {
        return (7.5625 * (progress -= (2.625 / 2.75)) * progress + 0.984375);
      }
    },

    /**
     * Helper to get a drop point from a height.
     * @private
     * @param {Number} [height=topY]
     * @return {L.Point} Current new {L.Point} instance with new coordinates
     */
    _getDropPoint: function(height) {
      // Get current coordidates in pixel
      this._point = this._toPoint(this._origLatlng);
      let topY;
      if (height === undefined || height < 0) {
        topY = this._toPoint(this._map.getBounds()._northEast).y;
      } else {
        topY = this._point.y - height;
      }
      return new L.Point(this._point.x, topY);
    },

    /**
     * Make a marker bounce at anytime you wish.
     * @param {bounceOnAddOptions} options - user defined options
     * @param {?bounceOnAddCallback} endCallback - run at end of animation
     * @example
     * marker = new L.Marker([48.85, 2.35], {bounceOnAdd: true}).addTo(map);
     * marker.on('click', function () {
     *     marker.bounce({duration: 500, height: 100});
     * });
     */
    bounce: function(options, endCallback) {
      if (typeof options === 'function') {
        endCallback = options;
        options = null;
      }
      options = options || {duration: 1000, height: -1, loop: 1};

      // Keep original latitude, longitude and map center
      this._origLatlng = this.getLatLng();
      this._origMapCenter = this._map.project(this._map.getCenter());
      this._dropPoint = this._getDropPoint(options.height);
      this._bounceMotion(options, endCallback);
    },

    /**
     * Stop the animation and place the marker at its destination.
     * @return {void}
     */
    stopBounce: function() {
      // We may have modified the marker; so we need to place it where it
      // belongs so next time its coordinates are not changed.
      if (typeof this._origLatlng !== 'undefined') {
        this.setLatLng(this._origLatlng);
      }
      L.Util.cancelAnimFrame(this._animationId);
    },

    /**
     * Add a Marker to {map} and optionaly make it bounce.
     * @override
     * @param {L.Map} map - Leaflet map to add the marker to
     * @example
     * L.marker([48.85, 2.35],
     *   {
     *     bounceOnAdd: true,
     *   }).addTo(map);
     */
    onAdd: function(map) {
      this._map = map;

      // Call leaflet original method to add the Marker to the map.
      originalOnAdd.call(this, map);

      if (this.options.bounceOnAdd === true) {
        this.bounce(this.options.bounceOnAddOptions,
            this.options.bounceOnAddCallback);
      }
    },

    /**
     * Stop any animation running and remove the Marker from {map}.
     * @override
     * @param {L.Map} map - Leaflet map to add the marker to
     */
    onRemove: function(map) {
      this.stopBounce();
      originalOnRemove.call(this, map);
    },
  });
})();
