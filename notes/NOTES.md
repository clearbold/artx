ArtX Notes and Questions
========================

Load More
---------
The "Load More" functionality requires 2 things in order to work:

1. A "Load More" link must be inserted directly following the item list container, like so:
`<a href="#" id="load-more" class="btn btn-block btn-hidden" data-feed="/LoadFavorites/">Load more</a>`

 The `data-feed` attribute should point to the appropriate JSON URL for the items to be fetched.

2. An underscore.js template script must be placed after the Load More link.  Here is a complex example, which displays a thumbnail list item as seen on the Favorites page:

```
<script type="text/template" id="item-template">

    <% _.each(jsonArray, function(eventObj, key){ %>

    <% var eventStartDate = moment(eventObj.start_date).format("ddd, MMM Do YYYY"); // "Sun, Feb 14th 2010" %>
    <% var eventStartTime = moment(eventObj.start_date).format("h:mm a"); // "10:15 am" %>

    <% var eventEndDate = moment(eventObj.end_date).format("MMM Do, YYYY"); // "Feb 14th, 2010" %>
    <% var eventEndTime = moment(eventObj.end_date).format("h:mm a"); // "10:15 am" %>

    <% var compareStartDate = moment(eventObj.start_date).format("M/D/YYYY"); // "2/14/2010" %>
    <% var compareEndDate = moment(eventObj.end_date).format("M/D/YYYY"); // "2/14/2010" %>
            
    <div class="item-block cf">
        <div class="item-image">
            <a href="exhibition.html">
                <img src="<%= eventObj.image %>" alt="" />
            </a>
        </div>
        <div class="item-info">
            <h2 class="item-title">
                <% if (eventObj.event_type == "exhibition") { %>
                <a href="exhibition.html" class="truncate"><%= eventObj.name %></a>
                <% } else { %>
                <a href="event.html" class="truncate"><%= eventObj.name %></a>
                <% } %>
            </h2>
            <p class="item-venue"><%= eventObj.location.name %></p>
            <p class="item-date">
            <% if (compareStartDate != compareEndDate) { %>
                Through <%= eventEndDate %>
            <% } else { %>
                <%= eventStartDate %><br />
                <%= eventStartTime %> - <%= eventEndTime %>
            <% } %>
            </p>

            <a href="#" class="favorite-star item-symbol" data-eventID="1" title="Toggle as a favorite"><i class="icon icon-star2"></i><span class="visuallyhidden">Toggle as a favorite</span></a>
        </div>
    </div>

    <% }); %>
</script>
```

Notes
-----

* There's an assumption in place that we can get main images that are at least 640 x 320, and that all images in a given set (all feature images, for example, or all thumbnail images) will have the same width/height ratio.  If images will be different sizes or ratios, we will probably need to tweak the styles once we are pulling in real content.

* Currently there is a bit of a jump as the main slider moves from first to last or last to first, due to something about the cloned slides required for "infinite loop" sliding (still in progress).

* We currently do not have a check in place to only initialize the sliding script when there are an appropriate number of slides (still in progress).

* Fallbacks are in place for visitors without Javascript enabled, and for visitors without touch capabilities (viewing it using a browser like Safari or Chrome on their desktop).


Questions
---------

* Will the backend system have a way of cropping/sizing the images to the sizes we need (400x400 square, 640x320 rectangle)?

* How many Discover "tiles" do we anticipate having at a time?  With the featured images being 640 x 320 (in order to look nice on retina), that can be up to 90K or so per image, and that could add up quickly and be both a data usage and a performance hit.