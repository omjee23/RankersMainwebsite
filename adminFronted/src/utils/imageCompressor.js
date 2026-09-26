/**
 * Utility to compress and resize image on the client-side using HTML5 Canvas.
 * Reduces 5MB-15MB camera/gallery photos down to ~30KB - 50KB in milliseconds,
 * keeping the database light, fast, and load-free!
 */
export const compressImage = (file, options = {}) => {
  const { maxWidth = 500, maxHeight = 500, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
    }

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-performance JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas compression failed'));
            }
            const compressedSizeKb = Math.round(blob.size / 1024);
            const savedPercent = Math.max(0, Math.round((1 - compressedSizeKb / Math.max(1, originalSizeKb)) * 100));

            resolve({
              blob,
              dataUrl,
              originalSizeKb,
              compressedSizeKb,
              savedPercent,
              width,
              height
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to parse image file'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Format photo URL to work correctly across both dev and production
 */
export const resolvePhotoUrl = (photo) => {
  if (!photo) return '/assets/web/faculty-team-full.png';
  if (photo.startsWith('data:') || photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  if (photo.startsWith('/uploads/')) {
    return `http://localhost:5001${photo}`;
  }
  return photo;
};
