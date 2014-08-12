## JSON
#### WAS 
##### GetEventsByDate/*year (yyyy)*/*month (mm)*/*date (dd)*
* **year/month/date** should sufficiently filter results to not require "Load More" functionality
* **Used on:** Calendar

#### NOW 
##### GET /events.json?year=2014&month=08&date=31

#### WAS 
##### GetEventsByLocation/*locationId*/*page*
* **Page:** Accommodates "Load More" functionality
* **Used on:** Locations/Map

#### NOW 
##### GET /locations/:location_id/events.json?page=1&per_page=10

#### WAS 
##### /LoadFavorites/*page*/*count*
* We'll be using this in multiple spots
* In the Favorites bar, we may ask for p1 with a count
* In "Load More" we'll dicate the number per "page" and we'll keep asking for pages. When the server runs out (results<count), we'll stop showing the link

#### NOW 
##### GET /favorites.json
###### takes
* authentication_token: authentication_token

#### WAS 
##### /LoadHistory/*page*
* Do we need to limit history and support "load more"

#### NOW 
##### GET /history.json?page=1&per_page=10
###### takes
* authentication_token: authentication_token

#### WAS 
##### /LoadInterests/*page*
* Do we need to limit interests and support "load more"

#### NOW 
##### GET /interests.json?page=1&per_page=10
###### takes
* authentication_token: authentication_token

#### WAS 
##### /SetInterest/
* interestCheckbox: checkboxID,
  interestSelected: isCheckboxChecked
* **Used on:** My Interests (Ajax when checkbox is checked or unchecked)

#### NOW 
##### POST /interests.json
###### takes
* authentication_token: authentication_token
* interest_id: interest_id,

#### WAS 
##### /SetOption/
* settingCheckbox: checkboxID,
  settingSelected: isCheckboxChecked
* **Used on:** Settings page (Ajax when on/off toggle is changed)

#### NOW 
##### PATCH /users.json
###### takes
* authentication_token: authentication_token
* <setting>: <value>

## HTML (Not changed)
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

## AUTH (Will change)
#### CheckEmail/*emailAddress*
* Returns success/failure based on existence of **emailAddress** in database
* **Used on:** Signup
