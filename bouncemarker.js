/**
 * Copyright (C) 2013 Maxime Hadjinlian <maxime.hadjinlian@gmail.com>
 * All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

(function () {

  // Retain the value of the original onAdd function
  var originalOnAdd = L.Marker.prototype.onAdd;

  // Add bounceonAdd options
  L.Marker.mergeOptions({
    bounceOnAdd: false,
    bounceOnAddDuration: 1000,
    bounceOnAddHeight: -1
  });

  L.Marker.include({

    _toPoint: function (latlng) {
      return this._map.latLngToContainerPoint(latlng);
    },
    _toLatLng: function (point) {
      return this._map.containerPointToLatLng(point);
    },

    _animate: function (opts) {
      var start = new Date();
      var id = setInterval(function () {
        var timePassed = new Date() - start;
        var progress = timePassed / opts.duration;
        if (progress > 1) {
          progress = 1;
        }
        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress === 1) {
          opts.end();
          clearInterval(id);
        }
      }, opts.delay || 10);
    },

    _move: function (delta, duration) {
      var original = L.latLng(this._orig_latlng),
          start_y = this._drop_point.y,
          start_x = this._drop_point.x,
          distance = this._point.y - start_y;
      var self = this;

      this._animate({
        delay: 10,
        duration: duration || 1000, // 1 sec by default
        delta: delta,
        step: function (delta) {
          self._drop_point.y = 
            start_y 
            + (distance * delta) 
            - (self._map.project(self._map.getCenter()).y - self._orig_map_center.y);
          self._drop_point.x = 
            start_x 
            - (self._map.project(self._map.getCenter()).x - self._orig_map_center.x); 
          self.setLatLng(self._toLatLng(self._drop_point));
        },
        end: function () {
          self.setLatLng(original);
        }
      });
    },

    // Many thanks to Robert Penner for this function
    _easeOutBounce: function (pos) {
      if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    // Bounce : if height in pixels is not specified, drop from top.
    // If duration is not specified animation is 1s long.
    bounce: function (duration, height) {
      // Keep original map center
      this._orig_map_center = this._map.project(this._map.getCenter());
      this._drop_point = this._getDropPoint(height);
      this._move(this._easeOutBounce, duration);
    },

    // This will get you a drop point given a height.
    // If no height is given, the top y will be used.
    _getDropPoint: function (height) {
      // Get current coordidates in pixel
      this._point = this._toPoint(this._orig_latlng);
      var top_y;
      if (height === undefined || height < 0) {
        top_y = this._toPoint(this._map.getBounds()._northEast).y;
      } else {
        top_y = this._point.y - height;
      }
      return new L.Point(this._point.x, top_y);
    },

    onAdd: function (map) {
      this._map = map;
      // Keep original latitude and longitude
      this._orig_latlng = this._latlng;

      // We need to have our drop point BEFORE adding the marker to the map
      // otherwise, it would create a flicker. (The marker would appear at final
      // location then move to its drop location, and you may be able to see it.)
      if (this.options.bounceOnAdd === true) {
        this._drop_point = this._getDropPoint(this.options.bounceOnAddHeight);
        this.setLatLng(this._toLatLng(this._drop_point));
      }

      // Call leaflet original method to add the Marker to the map.
      originalOnAdd.call(this, map);

      if (this.options.bounceOnAdd === true) {
        this.bounce(this.options.bounceOnAddDuration, this.options.bounceOnAddHeight);
      }
    }
  });
})();
