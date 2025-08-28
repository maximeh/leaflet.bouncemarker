# BounceMarker for Leaflet

This little plugin for [Leaflet](https://www.leafletjs.com) will make a Marker
bounce when you add it on a map on whenever you want it to.

Watch the [demo](http://maximeh.github.io/leaflet.bouncemarker/).

## Compatibility

This plugin is compatible with:
- Leaflet 1.x (use the global `L` object)
- Leaflet 2.x (use ESM imports or the global script)

# Version

Things may break in master, so please don't use this in production.
[Tags](https://github.com/maximeh/leaflet.bouncemarker/tags) should be preferred for used in production.

# Documentation

## Functions

<dl>
<dt><a href="#bounce">bounce(options, endCallback)</a></dt>
<dd><p>Make a marker bounce at anytime you wish.</p>
</dd>
<dt><a href="#stopBounce">stopBounce()</a> ⇒ <code>void</code></dt>
<dd><p>Stop the animation and place the marker at its destination.</p>
</dd>
<dt><a href="#onAdd">onAdd(map)</a></dt>
<dd><p>Add a Marker to {map} and optionaly make it bounce.</p>
</dd>
<dt><a href="#onRemove">onRemove(map)</a></dt>
<dd><p>Stop any animation running and remove the Marker from {map}.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#bounceOnAddOptions">bounceOnAddOptions</a> : <code>Object</code></dt>
<dd><p>User defined options</p>
</dd>
<dt><a href="#bounceOnAddCallback">bounceOnAddCallback</a> ⇒ <code>void</code></dt>
<dd><p>Callback run at the end of the whole animation.</p>
</dd>
</dl>

<a name="bounce"></a>

## bounce(options, endCallback)
Make a marker bounce at anytime you wish.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>bounceOnAddOptions</code>](#bounceOnAddOptions) | user defined options |
| endCallback | [<code>bounceOnAddCallback</code>](#bounceOnAddCallback) | run at end of animation |

**Example**
```js
// Leaflet 2.x with ESM
import { Marker } from 'leaflet';
const marker = new Marker([48.85, 2.35], {bounceOnAdd: true}).addTo(map);
marker.on('click', function () {
    marker.bounce({duration: 500, height: 100});
});

// Leaflet 2.x with global script or Leaflet 1.x
const marker = new L.Marker([48.85, 2.35], {bounceOnAdd: true}).addTo(map);
marker.on('click', function () {
    marker.bounce({duration: 500, height: 100});
});
```
<a name="stopBounce"></a>

## stopBounce() ⇒ <code>void</code>
Stop the animation and place the marker at its destination.

**Kind**: global function
<a name="onAdd"></a>

## onAdd(map)
Add a Marker to {map} and optionaly make it bounce.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| map | <code>L.Map</code> | Leaflet map to add the marker to |

**Example**
```js
// Leaflet 2.x with ESM
import { Marker } from 'leaflet';
new Marker([48.85, 2.35],
  {
    bounceOnAdd: true,
  }).addTo(map);

// Leaflet 2.x with global script or Leaflet 1.x
new L.Marker([48.85, 2.35],
  {
    bounceOnAdd: true,
  }).addTo(map);
```
<a name="onRemove"></a>

## onRemove(map)
Stop any animation running and remove the Marker from {map}.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| map | <code>L.Map</code> | Leaflet map to add the marker to |

<a name="bounceOnAddOptions"></a>

## bounceOnAddOptions : <code>Object</code>
User defined options

**Kind**: global typedef
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [bounceOnAddOptions.duration] | <code>Number</code> | <code>1000</code> | Animation's duration in ms. |
| [bounceOnAddOptions.height] | <code>Number</code> | <code>topY</code> | Height (in pixel) from which the marker is "dropped". |
| [bounceOnAddOptions.loop] | <code>Number</code> | <code>1</code> | Number of times the animation should play. -1 is a special value for infinite loop. |

<a name="bounceOnAddCallback"></a>

## bounceOnAddCallback ⇒ <code>void</code>
Callback run at the end of the whole animation.

**Kind**: global typedef

# Usage

## Leaflet 2.x with ESM modules

```html
<script type="importmap">
    {
        "imports": {
            "leaflet": "https://unpkg.com/leaflet@2.0.0/dist/leaflet.js"
        }
    }
</script>
<script type="module">
    import { Map, TileLayer, Marker } from 'leaflet';
    import 'path/to/bouncemarker.js';

    const map = new Map('map').setView([48.85, 2.35], 13);
    const marker = new Marker([48.85, 2.35], {
        bounceOnAdd: true,
        bounceOnAddOptions: {duration: 500, height: 100}
    }).addTo(map);
</script>
```

## Leaflet 2.x with global script or Leaflet 1.x

```html
<!-- For Leaflet 2.x -->
<script src="https://unpkg.com/leaflet@2.0.0/dist/leaflet-global.js"></script>
<!-- For Leaflet 1.x -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script src="path/to/bouncemarker.js"></script>
<script>
    const map = new L.Map('map').setView([48.85, 2.35], 13);
    const marker = new L.Marker([48.85, 2.35], {
        bounceOnAdd: true,
        bounceOnAddOptions: {duration: 500, height: 100}
    }).addTo(map);
</script>
```
