# Generate PNG Icons for Roxify

## Quick Task: Create apple-touch-icon.png

You're seeing a 404 for `/apple-touch-icon.png` because we only have SVG templates.

### Fastest Method: Online Converter

1. **Go to**: https://cloudconvert.com/svg-to-png (or https://convertio.co/svg-png/)
2. **Upload**: `public/icon.svg` from this repo
3. **Settings**: 
   - Width: 180 pixels
   - Height: 180 pixels
   - Background: Keep transparent OR use #E63946 (brand red)
4. **Download** as: `apple-touch-icon.png`
5. **Save to**: `public/apple-touch-icon.png`

### Alternative: Use Figma/Sketch
1. Open SVG in Figma
2. Export as PNG at 180x180
3. Save as `apple-touch-icon.png`

### What the Icon Should Look Like:
- Red background (#E63946)
- White lightning bolt in center
- 180x180 pixels
- PNG format

### After Creating:
```bash
# Commit the new icon
git add public/apple-touch-icon.png
git commit -m "Add apple-touch-icon.png for iOS PWA"
git push
```

### Optional: Generate All Icon Sizes
While you're at it, you can also create:
- `icon-192.png` (192x192) - Android
- `icon-512.png` (512x512) - Android splash
- `favicon.ico` (32x32) - Browser tab

But `apple-touch-icon.png` is the most important one for now!
