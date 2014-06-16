#!/usr/bin/python

import sys
import requests
import requests_cache
import yaml
import time
import re

#TODO: same folder for each type?
#TODO: rel or abs paths?

SETTINGS = {"post_types": [{"type": "event", "url": "http://artx.herokuapp.com/events.json", "dest": "../_source/_posts/"}, {"type": "location","url": "http://artx.herokuapp.com/locations.json", "dest": "../_source/_posts/"}]}

    
def main():

    for post_type in SETTINGS['post_types']:
        feed = fetch(post_type['url'])
        for i in feed:
            post = factory(post_type['type'], i)
            post.clean_content()
            filename = post.set_path(post_type['dest'])
            post.write(filename)

            
def fetch(src):

        """Fetch JSON post feed from either url or cache """

    #TODO: is this right? Does the requests get method check the cache automatically first?

    requests_cache.install_cache(expire_after=10)

    return requests.get(src).json()

                
def factory(type, json):

    
    class Post:

        
        def __init__(self, json):
            self.json = json

                        
        def clean_content(self):

            """Converts post content to ascii string in preparation for YAML dump"""
            
            for key in self.json:
                if not isinstance(json[key], basestring):
                    json[key] = str(json[key])
                json[key] = json[key].encode('ascii', 'ignore')
                key = key.encode('ascii', 'ignore')     

                
        def clean_title(self):

            """Takes a string, replaces whitespace with '-', converts to lowercase, removes all characters not specified as valid filename chars in settings"""

             valid_chars = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            title = self.json['name'].strip().replace(" ", "-").lower()
            title = ''.join(c for c in title if c in valid_chars)
            return title

        
        def clean_date(self, date_str):

            """Takes a string, extracts date (assumes format Month d(d), yyyy), converts to format YYYY-MM-DD"""
            #TODO: How to handle edge cas
            # This is the pattern most dates are in
            # pattern = re.compile("[A-Za-z]*\s\d{1,2},\s\d{2,4}")
            # match = re.search(pattern, date_str)
            # if match:
            #    date_str = match.group()
            #    converted_from = "%B %d, %Y"
            #    converted_to = "%Y-%m-%d"
            #    return time.strftime(converted_to, (time.strptime(date_str, converted_from)))

            # Temporary
            return "9999-99-99"

                
        def write(self, filename):

            """Takes a filename and dumps post data as YAML into file"""

            file_write = file(filename, 'w')
            yaml.dump(self.json, file_write)
            file_write.close()               


    class Event(Post):

        def __init__(self, json):
            Post.__init__(self, json)
            
        def clean_content(self):
            #TODO: location customization code here?
            self.json['type'] = "event"
            Post.clean_content(self)

        def set_path(self, dest):
            title = Post.clean_date(self, self.json['dates']) + "-" + Post.clean_title(self)
            path = dest + title + ".html"
            return path
            
    class Location(Post):

        def __init__(self, json):
            Post.__init__(self, json)

        def clean_content(self):
            self.json['type'] = "location"
            Post.clean_content(self)
            
        def set_path(self, dest):
            title = Post.clean_date(self, self.json['created_at']) + "-" + Post.clean_title(self)
            path = dest + title + ".html"
            return path
            
            
    if type == "event":
        return Event(json)
    if type == "location":
        return Location(json)

        
if __name__ == '__main__':
  main()

  
