Bouncemarker plugin for Leaflet
===============================

This little plugin for [Leaflet](http://www.leafletjs.com) will make a Marker
bounce when you add it on a map on whenever you want it to.

Watch the [demo](http://maximeh.github.com/leaflet.bouncemarker/).

#Version

Things may break in master, so please don't use this in production.
There is [tags](https://github.com/maximeh/leaflet.bouncemarker/tags) which can
be used in production.

Last stable: [v1.0](https://github.com/maximeh/leaflet.bouncemarker/tree/v1.0)

#Usage

Let's consider we have a Leaflet map:

```javascript
var map = L.map('map');
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
}).addTo(map);
```

##onAdd

To benefit from the bouncing effect when adding your marker, you must set
bounceOnAdd option when initializing your Marker:

```javascript
L.marker([48.85, 2.35], { bounceOnAdd: true }).addTo(map);
```

If you don't want your Marker to bounce on add, simply ignore the option to
obtain the default behavior:

```javascript
L.marker([48.85, 2.35]).addTo(map);
```

You can also pass some options arguments as an object to customise the animation:
```javascript
// take 500ms to bounce from 100px height
L.marker([48.85, 2.35], { bounceOnAdd: true, bounceOnAddOptions: {duration: 500, height: 100} }).addTo(map);
```

**DEPRECATED METHOD**

You can also use the optional bounceOnAddDuration and bounceOnAddHeight
arguments to customise the animation:

```javascript
// take 500ms to bounce from 100px height
L.marker([48.85, 2.35], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 100 }).addTo(map);
```

##bounce

You can also use the ``bounce()`` function to make a marker bounce, when you
want it to (you can also pass an object to customise the animation):

```javascript
L.marker([48.85, 2.35])
  .addTo(map)
  .on('click', function () {
    this.bounce({
        duration: 500,
        height: 100
      });
  });
```

**DEPRECATED METHOD**

You can also pass arguments to bounce() to customise the marker's animation:

```javascript
L.marker([48.85, 2.35])
  .addTo(map)
  .on('click', function () {
    this.bounce(500, 100);
  });
```

