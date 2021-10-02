# Bouncemarker plugin for Leaflet

This little plugin for [Leaflet](https://www.leafletjs.com) will make a Marker
bounce when you add it on a map on whenever you want it to.

Watch the [demo](http://maximeh.github.io/leaflet.bouncemarker/).

# Version

Things may break in master, so please don't use this in production.
There is [tags](https://github.com/maximeh/leaflet.bouncemarker/tags) which can
be used in production.

Last stable: [v1.2.3](https://github.com/maximeh/leaflet.bouncemarker/releases/tag/v1.2.3)

# Usage

Let's consider we have a Leaflet map:

```javascript
var map = L.map('map');
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
}).addTo(map);
```

## onAdd

Make your marker bounce when you add them to a map.

```javascript
L.marker([48.85, 2.35],
  {
    boolean bounceOnAdd,
    object bounceOnAddOptions,
    function bounceOnAddCallback
  }).addTo(map);
```

### bounceOnAdd (boolean) (optional)

If true, your marker will bounce when added to the map. Default to false.

### bounceOnAddOptions (object) (optional)

* duration (integer) (Default: 1000)

    The duration of the animation in milliseconds.

* height (integer) (Default: top_y)

    The height (in pixel) at which the marker is "dropped".
    The default is the top point on the y axis of the Marker.

* loop (integer) (Default: 1)

    The number of times the animation should play.
    -1 is a special value for infinite loop.

### bounceOnAddCallback (function) (optional)

If you specify the callback parameter, it will be called at the end of the
animation.

**Example:**
```javascript
L.marker([48.85, 2.35],
  {
    bounceOnAdd: true,
    bounceOnAddOptions: {duration: 500, height: 100, loop: 2},
    bounceOnAddCallback: function() {console.log("done");}
  }).addTo(map);
```

## bounce

Make a marker bounce at anytime you wish.

```javascript
bounce(object options, function callback);
```

**Example:**
```javascript
marker = new L.Marker([48.85, 2.35], {bounceOnAdd: true}).addTo(map);
marker.on('click', function () {
    marker.bounce({duration: 500, height: 100});
});
```

### options (object) (optional)

* duration (integer) (Default: 1000)

    The duration of the animation in milliseconds.

* height (integer) (Default: top_y)

    The height (in pixel) at which the marker is "dropped".
    The default is the top point on the y axis of the Marker.

* loop (integer) (Default: 1)

    The number of times the animation should play.
    -1 is a special value for infinite loop.

### callback (function) (optional)

If you specify the callback parameter, it will be called at the end of the
animation.

**Example:**
```javascript
marker.bounce({duration: 500, height: 100}, function(){console.log("done")});
```

## stopBounce

Will stop the animation when called; the marker will be positionned at its
destination.
