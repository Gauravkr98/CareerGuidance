# Image Assets Folder

This folder contains all the images used in the CareerCompass AI application.

## Folder Structure

```
/assets/images/
├── README.md          # This file - instructions for managing images
├── config.ts          # Central configuration file for all image URLs
├── hero/              # Hero and welcome screen images
├── auth/              # Login and signup screen images
└── careers/           # Career-specific images
```

## How to Change Images

### Method 1: Using the Config File (Recommended)

1. Open `/assets/images/config.ts`
2. Find the image you want to change
3. Replace the URL with your new image URL
4. Save the file - changes will reflect immediately!

Example:
```typescript
export const images = {
  hero: {
    welcomeBanner: "YOUR_NEW_IMAGE_URL_HERE"
  },
  // ... more images
};
```

### Method 2: Using Local Images

1. Place your image file in the appropriate folder:
   - `/assets/images/hero/` for hero images
   - `/assets/images/auth/` for login/signup images
   - `/assets/images/careers/` for career images

2. Open `/assets/images/config.ts`
3. Import your image at the top:
   ```typescript
   import myImage from './hero/myimage.jpg';
   ```
4. Use it in the config:
   ```typescript
   welcomeBanner: myImage
   ```

## Image Categories

### Hero Images
- **welcomeBanner**: Main banner on welcome screen (Recommended size: 1920x1080)

### Authentication Images
- **loginBanner**: Background image for login screen (Recommended size: 1920x1080)
- **signupBanner**: Background image for signup screen (Recommended size: 1920x1080)

### Career Images
- **technology**: Images for tech-related careers (Recommended size: 1200x800)
- **business**: Images for business careers (Recommended size: 1200x800)
- **creative**: Images for creative careers (Recommended size: 1200x800)
- **professional**: Images for professional careers (Recommended size: 1200x800)
- **teamwork**: Images for teamwork-related careers (Recommended size: 1200x800)

## Tips for Selecting Images

1. **Resolution**: Use high-quality images (at least 1200px width)
2. **Aspect Ratio**: 16:9 works best for most images
3. **Natural Look**: Choose photos of real people in work environments
4. **Diversity**: Include diverse representation in your images
5. **Professional**: Avoid overly staged or stock-photo looking images

## Currently Used Image Sources

All current images are sourced from Unsplash. You can:
- Keep using these Unsplash URLs
- Replace with your own images
- Use other stock photo services (Pexels, Pixabay, etc.)
- Use your own photography

## Need Help?

If you need to change images across the entire app, just edit the `config.ts` file. All components automatically use images from this central configuration.
