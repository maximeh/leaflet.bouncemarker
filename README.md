Bouncemarker plugin for Leaflet
===============================

This little plugin for [Leaflet](http://www.leafletjs.com) let you animate
a marker when you add it on a map.

Watch the [demo](http://maximeh.github.com/leaflet.bouncemarker/).

Usage
-----

Usage is very simple. Let's consider we have a Leaflet map:

```javascript
var map = L.map('map');
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
}).addTo(map);
```
To benefit from the bouncing effect, you have nothing to do, just use your
Marker as usual :

```javascript
L.marker([48.85, 2.35]).addTo(map);
```

You may use the autoBounce option if you do not want your marker to bounce when
added to the map (which is the default behavior):

```javascript
L.marker([48.85, 2.35], {autoBounce: false}).addTo(map);
```

You can also use the ``bounce()`` function to make a marker bounce, when you want it
to :

```javascript
L.marker([48.85, 2.35], {autoBounce: false})
 .addTo(map)
 .on('click', function () {
    this.bounce(500, 100);  // Bounce during 500ms from 100px height.
  });
```



