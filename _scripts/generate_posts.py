#!/usr/bin/python

import sys
import requests
import yaml
import re

#TODO: caching, exhibitions, aaply event changes to locations (or abstract them in parent class), docstrings

class JSONFeedReader:

    def __init__(self, url):
        self.url = url
        self.posts = requests.get(self.url).json()

class EventFeedReader(JSONFeedReader):

    def __init__(self):
        JSONFeedReader.__init__(self, "http://artx.herokuapp.com/events.json")
        
    def generate_posts(self):
        for i in range(len(self.posts)):
            post = self.posts[i]
            post['location'] = "" # temporary

            #Todo: String formatting, add new lines between entries
            # for key in post:
                #if isinstance(post, basestring):
                #    post[key] = post[key].encode('ascii', 'ignore') + "\n" 
                #else:
                #    post[key] = str(post[key])            


            e = Event(post['name'], post['id'], post['image'], post['description'], post['url'], post['tags'])
            filename = "../_source/posts/event-" + str(i) + ".html"
            filewrite = file(filename, 'w')
            yaml.dump(e, filewrite)
            filewrite.close()
        
class LocationFeedReader(JSONFeedReader):

    def __init__(self):
        JSONFeedReader.__init__(self, "http://artx.herokuapp.com/locations.json")

    def generate_posts(self):
        for post in self.posts:

            for key in post:
                post[key] = str(post[key]) + "\n"

            l = Location(post_json['name'], post_json['id'], post_json['image'], post_json['description'], post_json['url'], post_json['latitude'], post_json['longitude'], post_json['created_at'], post_json['updated_at'])
        
class Post:

    title = ""

    def __init__(self, name, id, image, description, url):
        self.name = name
        self.id = id
        self.image = image
        self.description = description
        self.url = url

class Event(Post): 

    def __init__(self, name, id, image, description, url, tags):
        Post.__init__(self, name, id, image, description, url)    
        self.tags = tags

    #TODO title, location, dates fine tuning       
       
class Location(Post):

    def __init__(self, name, id, image, description, url, latitude, longitutde, created_at, updated_at): 

        Post.__init__(self, name, id, image, description, url)
        self.latitude = latitude
        self.longitude = longitude
        self.created_at = created_at
        self.updated_at = updated_at

                
# Gather our code in a main() function
def main():
    e = EventFeedReader()
    e.generate_posts()
    
if __name__ == '__main__':
  main()

  
