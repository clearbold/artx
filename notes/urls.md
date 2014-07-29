### Conventions:

* Get for a single item, usually by ID
* Set to POST data to the server to set a value
* Load for "Load More" methods
* Delete to remove value or relation

#### SetEventFavorite/*eventId*

* **Format:** JSON
* **Used on:** Discover, My Favorites, anywhere else Events appear

#### DeleteFavorite/*eventId*

* **Format:** JSON
* **Used on:** Discover, My Favorites, anywhere else Events appear

#### SetAttendance/*eventId*

* **Format:** JSON
* **Used on:** History

#### GetEvent/*eventId*

* **Format:** JSON

#### <strike>GetEventsByMonth/*year (yyyy)*/*month (mm)*</strike>

* **Format:** JSON
* **year/month** should sufficiently filter results to not require "Load More" functionality
* **Used on:** Calendar

#### GetEventsByDate/*year (yyyy)*/*month (mm)*/*date (dd)*

* **Format:** JSON
* **year/month/date** should sufficiently filter results to not require "Load More" functionality
* **Used on:** Calendar

#### GetEventsByLocation/*locationId*/*page*

* **Format:** JSON
* **Page:** Accommodates "Load More" functionality
* **Used on:** Locations/Map

#### GetLocations

* **Format:** JSON
* **Used on:** Locations/map

#### GetLocation/*locationId*

* **Format:** JSON
* **Used on:** Locations/map

#### CheckEmail/*emailAddress*

* **Format:** Ajax/JSON
* Returns success/failure based on existence of **emailAddress** in database
* **Used on:** Signup

#### /event/*eventId*

* **Format:** HTML
* Dynamic page with event data generated server-side

#### /location/*locationId*

* **Format:** HTML
* Dynamic page with location data generated server-side

#### /favorites

* **Format:** HTML
* Dynamic page with session user's favorites generated server-side

#### /LoadFavorites/*page*/*count*

* **Format:** JSON
* We'll be using this in multiple spots
* In the Favorites bar, we may ask for p1 with a count
* In "Load More" we'll dicate the number per "page" and we'll keep asking for pages. When the server runs out (results<count), we'll stop showing the link

#### /history

* **Format:** HTML
* Dynamic page with session user's history generated server-side

#### /LoadHistory/*page*

* **Format:** JSON
* Do we need to limit history and support "load more"

#### /interests

* **Format:** HTML
* Dynamic page with session user's interests generated server-side

#### /LoadInterests/*page*

* **Format:** JSON
* Do we need to limit interests and support "load more"

#### /SetInterest/

* **Format:** 
* interestCheckbox: checkboxID,
  interestSelected: isCheckboxChecked
* **Used on:** My Interests (Ajax when checkbox is checked or unchecked)

#### /settings

* **Format:** HTML
* Supports a POST to update settings based on field values submitted/saved

#### /SetOption/

* **Format:** 
* settingCheckbox: checkboxID,
  settingSelected: isCheckboxChecked
* **Used on:** Settings page (Ajax when on/off toggle is changed)
