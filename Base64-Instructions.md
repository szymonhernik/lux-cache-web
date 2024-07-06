### Instructions to Generate and Add Base64 Encoded Thumbnail to Sanity CMS for Video Asset Uploaded to Cloudinary

1. **Get the Asset Link from Sanity CMS Cloudinary Plugin:**

   - Locate and copy the link to the video asset from the Sanity CMS Cloudinary plugin.
   - Example link: `https://res.cloudinary.com/dmowkzh44/video/upload/LC_AMMONIA_BOA_GROAN_TUBE_1_wgv6hf.mp4`

2. **Configure the URL:**

   - Add the following configuration options to the URL to generate a thumbnail image:
     - `pg_1` to select the first frame of the video.
     - `w_25` to set the width to 25 pixels.
     - `h_25` to set the height to 25 pixels.
     - `f_png` to change the format to PNG.
   - Change the file extension from `.mp4` to `.png`.

   - Example URL after configuration:
     ```
     https://res.cloudinary.com/dmowkzh44/video/upload/pg_1/w_25/h_25/f_png/LC_AMMONIA_BOA_GROAN_TUBE_1_wgv6hf.png
     ```

3. **Convert Image to Base64:**

   - Go to the website: [Base64 Image Encoder](https://www.base64-image.de/)
   - Upload the image file using the configured URL.
   - Copy the generated Base64 code from the website.

4. **Paste Base64 Code in Sanity CMS:**
   - Navigate to the relevant field in Sanity CMS where the Base64 code needs to be added.
   - Paste the copied Base64 code into this field.

### Example of Base64 Encoded Thumbnail URL:

1. **Original Video URL:**

   ```
   https://res.cloudinary.com/dmowkzh44/video/upload/LC_AMMONIA_BOA_GROAN_TUBE_1_wgv6hf.mp4
   ```

2. **Configured Thumbnail URL:**

   ```
   https://res.cloudinary.com/dmowkzh44/video/upload/pg_1/w_25/h_25/f_png/LC_AMMONIA_BOA_GROAN_TUBE_1_wgv6hf.png
   ```

3. **Base64 Encoding Website:**

   - [Base64 Image Encoder](https://www.base64-image.de/)

4. **Sanity CMS Field:**
   - Paste the Base64 code in the specified field within Sanity CMS.

By following these steps, you can successfully generate and add a Base64 encoded thumbnail to Sanity CMS for your video asset uploaded to Cloudinary.
