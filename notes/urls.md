#### AddEventFavorite/*eventId*

#### GetEventById/*eventId*

#### GetEventsByMonth/*year (yyyy)*/*month (mm)*

* **Format:** JSON
* **year/month** should sufficiently filter results to not require "Load More" functionality

#### GetEventsByLocation/*locationId*/*page*

* **Format:** JSON
* **Page:** Accommodates "Load More" functionality

#### GetLocationById/*locationId*

#### CheckEmail/*emailAddress*

* **Format:** Ajax/JSON
* Returns success/failure based on existence of **emailAddress** in database