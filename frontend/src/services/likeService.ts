const LIKED_FUCKUPS_KEY = 'fuckup_board_liked_fuckups';

export const likeService = {
  // Get all liked fuckup IDs from localStorage
  getLikedFuckups: (): string[] => {
    try {
      const liked = localStorage.getItem(LIKED_FUCKUPS_KEY);
      return liked ? JSON.parse(liked) : [];
    } catch (error) {
      console.error('Error reading liked fuckups from localStorage:', error);
      return [];
    }
  },

  // Check if a fuckup is liked by the current user
  isLiked: (fuckupId: string): boolean => {
    const likedFuckups = likeService.getLikedFuckups();
    return likedFuckups.includes(fuckupId);
  },

  // Add a fuckup to the liked list
  addLikedFuckup: (fuckupId: string): void => {
    try {
      const likedFuckups = likeService.getLikedFuckups();
      if (!likedFuckups.includes(fuckupId)) {
        likedFuckups.push(fuckupId);
        localStorage.setItem(LIKED_FUCKUPS_KEY, JSON.stringify(likedFuckups));
      }
    } catch (error) {
      console.error('Error saving liked fuckup to localStorage:', error);
    }
  },

  // Remove a fuckup from the liked list (for future use if needed)
  removeLikedFuckup: (fuckupId: string): void => {
    try {
      const likedFuckups = likeService.getLikedFuckups();
      const updatedLikedFuckups = likedFuckups.filter(id => id !== fuckupId);
      localStorage.setItem(LIKED_FUCKUPS_KEY, JSON.stringify(updatedLikedFuckups));
    } catch (error) {
      console.error('Error removing liked fuckup from localStorage:', error);
    }
  },

  // Clear all liked fuckups (for testing or reset purposes)
  clearLikedFuckups: (): void => {
    try {
      localStorage.removeItem(LIKED_FUCKUPS_KEY);
    } catch (error) {
      console.error('Error clearing liked fuckups from localStorage:', error);
    }
  }
}; 