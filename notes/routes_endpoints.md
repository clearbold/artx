                  Prefix Verb   URI Pattern                          Controller#Action
                    root GET    /                                    home#index
          event_favorite POST   /events/:event_id/favorite(.:format) favorites#create
                  events GET    /events(.:format)                    events#index
                         POST   /events(.:format)                    events#create
               new_event GET    /events/new(.:format)                events#new
              edit_event GET    /events/:id/edit(.:format)           events#edit
                   event GET    /events/:id(.:format)                events#show
                         PATCH  /events/:id(.:format)                events#update
                         PUT    /events/:id(.:format)                events#update
                         DELETE /events/:id(.:format)                events#destroy
               locations GET    /locations(.:format)                 locations#index
                         POST   /locations(.:format)                 locations#create
            new_location GET    /locations/new(.:format)             locations#new
           edit_location GET    /locations/:id/edit(.:format)        locations#edit
                location GET    /locations/:id(.:format)             locations#show
                         PATCH  /locations/:id(.:format)             locations#update
                         PUT    /locations/:id(.:format)             locations#update
                         DELETE /locations/:id(.:format)             locations#destroy
                         # New
                         POST   /favorites(.:format)                 favorites#create
                         DELETE /favorites/:id(.:format)             favorites#destroy
                         POST   /attendances(.:format)               attendance#create
                         DELETE /attendances/:id(.:format)           attendance#destroy
                         POST   /interests(.:format)                 interests#create
                         DELETE /interests/:id(.:format)             interests#destroy
