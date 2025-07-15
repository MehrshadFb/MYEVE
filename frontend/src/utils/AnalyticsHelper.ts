// Utility function to get average rating
export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
};
