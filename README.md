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

Make your marker bounce when you add them to a map.

```javascript
L.marker([48.85, 2.35], { boolean bounceOnAdd, object bounceOnAddOptions, function bounceOnAddCallback }).addTo(map);
```

###bounceOnAdd (boolean) (optionnal)

If true, your marker will bounce when added to the map. Default to false.

###bounceOnAddOptions (object) (optionnal)

* bounceOnAddDuration (integer) (Default: 1000)

    The duration of the animation in milliseconds.

* bounceOnAddHeight (integer) (Default: top_y)

    The height (in pixel) at which the marker is "dropped".
    The default is the top point on the y axis of the Marker.

###bounceOnAddCallback (function) (optionnal)

If you specify the callback parameter, it will be called at the end of the
animation.

**Example:**
```javascript
L.marker([48.85, 2.35], { bounceOnAdd: true, bounceOnAddOptions: {duration: 500, height: 100}, bounceOnAddCallback: function() {console.log("done");} }).addTo(map);
```

**DEPRECATED**

```javascript
// take 500ms to bounce from 100px height
L.marker([48.85, 2.35], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 100 }).addTo(map);
```

##bounce

Make a marker bounce at anytime you wish.

```javascript
bounce(object options, function callback);
```

###options (object) (optionnal)

* duration (integer) (Default: 1000)

    The duration of the animation in milliseconds.

* height (integer) (Default: top_y)

    The height (in pixel) at which the marker is "dropped".
    The default is the top point on the y axis of the Marker.

###callback (function) (optionnal)

If you specify the callback parameter, it will be called at the end of the
animation.

**Example:**
```javascript
marker.bounce({duration: 500, height: 100}, function(){console.log("done")});
```

**DEPRECATED**

```javascript
L.marker([48.85, 2.35])
  .addTo(map)
  .on('click', function () {
    this.bounce(500, 100);
  });
```

