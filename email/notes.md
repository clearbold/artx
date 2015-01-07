### Content Questions

* What's the difference between

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

It's also recommended that we populate the @alt attribute on these images, as that will display in email clients where images are turned off.

#### Links

Note that all individual elements are linked. For example, each Recommended event has 3 links: 1 around the img, 1 around the first line of text/table cell, 1 around the second line of text/table cell.

#### Preheader

The email has a hidden preheader table at the top. This is hidden text that we don't reveal in the email, but which shows up in the inbox preview. You may customize this or make it dynamic, but do a personal inbox test to review it as you won't see it without doing so.