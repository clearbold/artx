#!/usr/bin/python

import sys
import requests
import requests_cache
import yaml
import time
import datetime
import re

#TODO: same folder for each type?
#TODO: rel or abs paths?

SETTINGS = {"feeds": [{"type": "event", "url": "http://artx.herokuapp.com/events.json"}, {"type": "location","url": "http://artx.herokuapp.com/locations.json"}]}

    
def main():

    for feed in SETTINGS['feeds']:
        posts_json = fetch(feed['type'], feed['url'])
        for i in posts_json:
            post = factory(feed['type'], i)
            post.generate()

            
def fetch(type, src):
    """Fetch JSON post feed from either url or cache """

    session = requests_cache.CachedSession(type, expire_after=1800)
    response = session.get(src)
    return response.json()

                
def factory(type, json):

    
    class Post:

        
        def __init__(self, json):

            # The JSON post contents
            self.json = json

            # Post name
            self.name = self.json['name']

            # Path to post folder
            self.path = "../_source/_posts/"

            # Date to be prepended to post title - defaults to now
            self.date = datetime.datetime.now().isoformat()
                            
        def generate(self):

            """Generate post title and dump JSON contents into YAML file"""
                
            # Format and assemble post location as 'path/YYYY-mm-dd-postname.html'  
            valid_chars = "abcdefghijklmnopqrstuvwxyz"
            words_unformatted = self.name.split(" ")
            words_formatted = []
            for i in range(len(words_unformatted)):
                word = words_unformatted[i].strip().lower()
                word = ''.join(c for c in word if c in valid_chars)
                words_formatted.append(word)
            title = "-".join(words_formatted)
            date_prefix = self.date.split("T")[0]
            self.path += date_prefix + "-" + title + ".html" 

            # Write YAML dump to file    
            file_write = file(self.path, 'w')
            yaml.safe_dump(self.json, file_write)
            file_write.close()               


    class Event(Post):

        def __init__(self, json):
            Post.__init__(self, json)
            if json.get('start_date'):
                self.date = json['start_date']
                
            
    class Location(Post):

        def __init__(self, json):
            Post.__init__(self, json)
            if json.get('created_at'):
                self.date = self.json['created_at']

                          
    if type == "event":
        return Event(json)
    if type == "location":
        return Location(json)

        
if __name__ == '__main__':
  main()
