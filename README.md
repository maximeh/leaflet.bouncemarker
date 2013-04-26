Bouncemarker plugin for Leaflet
===============================

This little plugin for [Leaflet](http://www.leafletjs.com) will make a Marker
bounce when you add it on a map on whenever you want it to.

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
To benefit from the bouncing effect, you must set bounceOnAdd option when
initializing your Marker:

```javascript
L.marker([48.85, 2.35], { bounceOnAdd: true }).addTo(map);
```

You can also use the optional bounceOnAddDuration and bounceOnAddHeight arguments to customise the animation:

```javascript
L.marker([48.85, 2.35], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 100 }).addTo(map); // take 500ms to bounce from 100px height
```

If you don't want your Marker to bounce on add, simply ignore the option to
obtain the default behavior:

```javascript
L.marker([48.85, 2.35]).addTo(map);
```

You can also use the ``bounce()`` function to make a marker bounce, when you
want it to:

```javascript
L.marker([48.85, 2.35])
 .addTo(map)
 .on('click', function () {
    this.bounce(500, 100); // take 500ms to bounce from 100px height
  });
```



