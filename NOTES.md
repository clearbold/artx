ArtX Notes and Questions
========================

Notes
-----

* The paper prototype had a "back" button at top left on the subpages like "Event", "Exhibition", and "Venue". We've replaced that with a Tags button which slides out a menu, so that the tags will be ever-present and easy to access.

* There's an assumption in place that we can get main images that are at least 640 x 320, and that all images in a given set (all feature images, for example, or all thumbnail images) will have the same width/height ratio.  If images will be different sizes or ratios, we will probably need to tweak the styles once we are pulling in real content.

* Currently there is a bit of a jump as the main slider moves from first to last or last to first, due to something about the cloned slides required for "infinite loop" sliding (still in progress).

* We currently do not have a check in place to only initialize the sliding script when there are an appropriate number of slides (still in progress).

* Fallbacks are in place for visitors without Javascript enabled, and for visitors without touch capabilities (viewing it using a browser like Safari or Chrome on their desktop).


Questions
---------

* Will the backend system have a way of cropping/sizing the images to the sizes we need (400x400 square, 640x320 rectangle)?

* How many Discover "tiles" do we anticipate having at a time?  With the featured images being 640 x 320 (in order to look nice on retina), that can be up to 90K or so per image, and that could add up quickly and be both a data usage and a performance hit.