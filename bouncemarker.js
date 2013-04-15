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
          clearInterval(id);
        }
      }, opts.delay || 10);
    },

    _move: function (delta, duration) {
      var start_point = this._drop_point.y,
          distance = this._point.y - start_point;
      var self = this;

      this._animate({
        delay: 10,
        duration: duration || 1000, // 1 sec by default
        delta: delta,
        step: function (delta) {
          self._drop_point.y = start_point + (distance * delta);
          self.setLatLng(self._toLatLng(self._drop_point));
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
    bounce: function(duration, height) {
      this._point = this._toPoint(this._latlng);
      var top_y = height === undefined ?
                  this._toPoint(this._map.getBounds()._northEast).y :
                  this._point.y - height;
      this._drop_point = new L.Point(this._point.x, top_y);
      this._move(this._easeOutBounce, duration);
    },

    onAdd: function (map) {
      originalOnAdd.call(this, map);
      if (typeof this.options.autoBounce === 'undefined' ||
          this.options.autoBounce === true){
          this.bounce();
      }
    }
  });
})();
