## JSON
#### GetEventsByDate/*year (yyyy)*/*month (mm)*/*date (dd)*
* **year/month/date** should sufficiently filter results to not require "Load More" functionality
* **Used on:** Calendar

#### GetEventsByLocation/*locationId*/*page*
* **Page:** Accommodates "Load More" functionality
* **Used on:** Locations/Map

#### /LoadFavorites/*page*/*count*
* We'll be using this in multiple spots
* In the Favorites bar, we may ask for p1 with a count
* In "Load More" we'll dicate the number per "page" and we'll keep asking for pages. When the server runs out (results<count), we'll stop showing the link

#### /LoadHistory/*page*
* Do we need to limit history and support "load more"

#### /LoadInterests/*page*
* Do we need to limit interests and support "load more"

#### /SetInterest/
* interestCheckbox: checkboxID,
  interestSelected: isCheckboxChecked
* **Used on:** My Interests (Ajax when checkbox is checked or unchecked)

#### /SetOption/
* settingCheckbox: checkboxID,
  settingSelected: isCheckboxChecked
* **Used on:** Settings page (Ajax when on/off toggle is changed)

## HTML
#### /settings
* Supports a POST to update settings based on field values submitted/saved

#### /history
* Dynamic page with session user's history generated server-side

#### /interests
* Dynamic page with session user's interests generated server-side

#### /event/*eventId*
* Dynamic page with event data generated server-side

#### /location/*locationId*
* Dynamic page with location data generated server-side

#### /favorites
* Dynamic page with session user's favorites generated server-side

## AUTH
#### CheckEmail/*emailAddress*
* Returns success/failure based on existence of **emailAddress** in database
* **Used on:** Signup
