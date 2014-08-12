## JSON (Changed)
### Events
###### Previously 
- GetEventsByDate/*year (yyyy)*/*month (mm)*/*date (dd)*
  - **year/month/date*  - should sufficiently filter results to not require "Load More" functionality
  - **Used on:*  - Calendar

##### New 
```
GET /events.json?year=2014&month=08&date=31
```

##### Previously 
- GetEventsByLocation/*locationId*/*page*
  - **Page:*  - Accommodates "Load More" functionality
  - **Used on:*  - Locations/Map

##### New 
```
GET /locations/:location_id/events.json?page=1&per_page=10
```

### Favorites
##### Previously 
-  /LoadFavorites/*page*/*count*
  - We'll be using this in multiple spots
  - In the Favorites bar, we may ask for p1 with a count
  - In "Load More" we'll dicate the number per "page" and we'll keep asking for pages. When the server runs out (results<count), we'll stop showing the link

##### New 
```
GET /favorites.json
```
-  takes
  - authentication_token: authentication_token

##### Previously 
-  /LoadHistory/*page*
  - Do we need to limit history and support "load more"

##### New 
```
GET /favorites/history.json?page=1&per_page=10
```
-  Notes: 
  - history is just favorite events that are in the past
  - will be viewed on a separate view, which will also present an attendance creation/deletion checkbox
-  takes
  - authentication_token: authentication_token

### Interests
##### Previously 
-  /LoadInterests/*page*
  - Do we need to limit interests and support "load more"

##### New 
```
GET /interests.json?page=1&per_page=10
```
-  takes
  - authentication_token: authentication_token

##### Previously 
-  /SetInterest/
  - interestCheckbox: checkboxID,
  interestSelected: isCheckboxChecked
  - **Used on:*  - My Interests (Ajax when checkbox is checked or unchecked)

##### New 
```
POST /interests.json
```
-  takes
  - authentication_token: authentication_token
  - interest_id: interest_id

### Users
##### Previously 
-  /SetOption/
  - settingCheckbox: checkboxID,
  settingSelected: isCheckboxChecked
  - **Used on:*  - Settings page (Ajax when on/off toggle is changed)

##### New 
```
PATCH /users.json
```
-  takes
  - authentication_token: authentication_token
  - setting: value

## HTML Pages (Updated)
#### /settings
- shows all of the current users' current settings, with toggles to update settings (via PATCH request to JSON API). 

#### /history
- shows all of the user's past favorites, with checkboxes for creation/deletion (via POSTs/DELETE requests to JSON API) of attendance resources.

#### /interests
- shows all of the current user's interests, with checkboxes for creation/deletion (via POSTs to JSON API) of interest resources.

#### /favorites
- shows all of the current user's favorited events, with star control for deletion of favorite available (via POST/DELETE to JSON API).

#### /event/:event_id
- shows a single event show view; data loaded via GET request to JSON endpoint.

#### /location/:location_id
- shows a single location show view; data loaded via GET request to JSON endpoint.

#### /bydate
- shows events on a date given in the query parameters; data loaded via GET request to JSON endpoint.

#### /bylocation
- shows events at a location given in the query parameters; data loaded via GET request to JSON endpoint.

## AUTH (Will change)
##### Previously 
-  CheckEmail/*emailAddress*
  - Returns success/failure based on existence of **emailAddress*  - in database
  - **Used on:*  - Signup
