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
            self.json = json
            self.name = self.json['name']
            self.path = "../_source/_posts/"
                        
        def generate(self):

            """Converts post content to ascii string in preparation for YAML dump"""
            
            # Encode all fetched data as ascii string 
            for key in self.json:
                if not isinstance(json[key], basestring):
                    json[key] = str(json[key])
                json[key] = json[key].encode('ascii', 'ignore')
                key = key.encode('ascii', 'ignore')  
                
            # Clean title   
            valid_chars = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            title = self.name.strip().replace(" ", "-").lower()
            title = ''.join(c for c in title if c in valid_chars)
            
         
            # Clean date
            #TODO: refactor after more specs received from client
            # pattern = re.compile("[A-Za-z]*\s\d{1,2},\s\d{2,4}")
            # match = re.search(pattern, date_str)
            # if match:
            #    date_str = match.group()
            #    converted_from = "%B %d, %Y"
            #    converted_to = "%Y-%m-%d"
            #    return time.strftime(converted_to, (time.strptime(date_str, converted_from)))

            # Temporary
            date = datetime.datetime.now().strftime("%Y-%m-%d")
            
            self.path += date + "-" + title + ".html" 

            # Write YAML dump to file    
            file_write = file(self.path, 'w')
            yaml.dump(self.json, file_write)
            file_write.close()               


    class Event(Post):

        def __init__(self, json):
            Post.__init__(self, json)
          
            
    class Location(Post):

        def __init__(self, json):
            Post.__init__(self, json)
            
            
    if type == "event":
        return Event(json)
    if type == "location":
        return Location(json)

        
if __name__ == '__main__':
  main()

  
