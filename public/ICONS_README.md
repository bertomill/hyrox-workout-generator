# PWA Icons Setup

This app requires icon files for full PWA functionality. The manifest.json references these icon files.

## Required Icon Files

You need to create the following icon files and place them in the `/public` directory:

### 1. **icon-192.png** (192x192 pixels)
- Purpose: Android home screen icon, splash screen
- Background: Solid #E63946 (red)
- Icon: White lightning bolt centered

### 2. **icon-512.png** (512x512 pixels)
- Purpose: Android splash screen, high-res displays
- Background: Solid #E63946 (red)
- Icon: White lightning bolt centered

### 3. **apple-touch-icon.png** (180x180 pixels)
- Purpose: iOS home screen icon
- Background: Solid #E63946 (red)
- Icon: White lightning bolt centered
- Note: Should have rounded corners (iOS applies automatically)

### 4. **favicon.ico** (32x32 pixels)
- Purpose: Browser tab icon
- Background: Solid #E63946 (red)
- Icon: White lightning bolt centered

## Design Guidelines

- **Brand Color**: #E63946 (Hyrox red)
- **Icon Shape**: Lightning bolt (represents speed, energy, Hyrox training)
- **Style**: Minimalist, modern, high-contrast
- **Background**: Solid color (no transparency for better compatibility)

## How to Create Icons

### Option 1: Use icon.svg (provided)
The `/public/icon.svg` file contains a scalable vector version. Convert this to PNG at the required sizes:
- Use online tool like [Favicon.io](https://favicon.io)
- Or use ImageMagick: `convert icon.svg -resize 192x192 icon-192.png`

### Option 2: Use Figma/Sketch
1. Create artboard at required size
2. Fill background with #E63946
3. Draw white lightning bolt icon (provided in SVG)
4. Export as PNG

### Option 3: Online PWA Icon Generator
Use a tool like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Testing PWA Installation

### iOS (Safari)
1. Visit the deployed site
2. Tap Share button
3. Tap "Add to Home Screen"
4. Verify icon appears correctly

### Android (Chrome)
1. Visit the deployed site
2. Tap the menu (⋮)
3. Tap "Add to Home screen" or "Install app"
4. Verify icon appears correctly

## Current Status

✅ manifest.json configured
✅ Icon SVG created as template
⏳ PNG icons need to be generated from SVG template
⏳ Favicon.ico needs to be created

Once icons are created, test the PWA installation on both iOS and Android devices.
