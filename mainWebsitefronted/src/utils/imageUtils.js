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
