### Completed Files

* `email/weekly.html` is the *source* HTML email.
* `email/weekly_inline.html` is the *live* HTML email that you'll want to use for integration. It's very dense with lots of inlined styles (from [inliner.cm](http://inliner.cm)). Such is email.
* `email/weekly_plaintext.txt` is the plaintext version you'll want to populate and include in a multipart package. Email services/clients look favorably upon multipart.

### To Do

* Font colors in AOL/Explorer
* Font colors in Outlook.com

### Content

Regarding the "See more..." links under "Your upcoming events" and "Your exhibitions" list, we're not distinguishing events & exhibitions in Favorites, so there's no way to link to those separately.

### Recommended and "Don't Miss" Events

I'm assuming only 2 events for the recommendations, as opposed to the 3 in the Google doc mockups. My reasoning is:

1. Our options for responsive email designs fall apart when we try to do more than 2 columns side by side. We do have techniques to flip 2 columns into stacked items while supporting columns in pickier versions of Outlook, which I've applied.
2. I think limiting options for users will lead to more clicks. Email is powerful, but also scanned quickly. If I can see two recommended items side by side, I just have 1 choice to make to tap or click one. If I'm likelier to tap, I'm more engaged.

### Implementation Notes

#### Images

You'll need to provide image URLs via the API that can resize images using server-side code. We have a number of CSS techniques in place in the website to make images uniform. We'll need a uniform height here. In the two-column layout, I'm rendering images at 282x188. This provides a 1.5:1 ratio similar to what we see in the mobile view of the web app.

We want to include @width and @height attributes on our images to establish their space in the layout in contexts where images are turned off, so I've coded those in to the img tags. This means that any images that come from the API should match 282x188, or be larger for responsive images (more on this in a bit).

If you're resizing images on the backend, you'll thus want to pad any images resized to 188px high with some left & right letter-boxing.

When the layout gets below 600px, these images flip to stacked and become 100% wide. A 282px wide img is going to be upsized to 600px wide, and will then scale down. On an iPhone, it will be 320px (375px/414px) wide.

It might be best to generate images at 564x376 with quality set to 60 or 70. That will provide enough pixel density at most resolutions or layouts while also aiming to keep file size in check. It's important to be mindful of file size in email, where users are more like to open something up on a cellular connection and incur data charges. (With the web app, they can choose not to browse to it.)

One possibility to support this would be an API endpoint that would take width & height parameters on the URL along with an event ID *or* img name, and would return the resized image.

It's also recommended that we populate the @alt attribute on these images, as that will display in email clients where images are turned off.

#### Links

Note that all individual elements are linked. For example, each Recommended event has 3 links: 1 around the img, 1 around the first line of text/table cell, 1 around the second line of text/table cell.

#### Preheader

The email has a hidden preheader table at the top. This is hidden text that we don't reveal in the email, but which shows up in the inbox preview. You may customize this or make it dynamic, but do a personal inbox test to review it as you won't see it without doing so.

### CAN-SPAM

CAN-SPAM law requires that you identify the sender with a real address, which I've accommodated in the footer.

See https://en.wikipedia.org/wiki/CAN-SPAM_Act_of_2003#The_mechanics_of_CAN-SPAM

### Analytics

You might want to explore how Mandrill supports click and open analytics. If we were sending these through an ESP there'd be more robust support on that front. Litmus has a more robust email analytics platform that can be included, but would cost additional money.