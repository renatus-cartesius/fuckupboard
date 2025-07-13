import { Fuckup } from '../types/Fuckup';

/**
 * Sorts fuckups by likes in descending order (most likes first)
 * If likes are equal, maintains the original order
 */
export const sortFuckupsByLikes = (fuckups: Fuckup[]): Fuckup[] => {
  return [...fuckups].sort((a, b) => {
    // Sort by likes in descending order
    if (a.likes !== b.likes) {
      return b.likes - a.likes;
    }
    // If likes are equal, maintain original order (stable sort)
    return 0;
  });
}; 