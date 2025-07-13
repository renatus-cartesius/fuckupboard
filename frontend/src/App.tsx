import React, { useState, useEffect } from 'react';
import './App.css';
import FuckupCard from './components/FuckupCard';
import AddFuckupForm from './components/AddFuckupForm';
import { Fuckup, AddFuckupRequest } from './types/Fuckup';
import { fuckupApi } from './services/api';
import { likeService } from './services/likeService';

function App() {
  const [fuckups, setFuckups] = useState<Fuckup[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedCount, setLikedCount] = useState(0);

  const fetchFuckups = async () => {
    try {
      setLoading(true);
      const data = await fuckupApi.getFuckups();
      setFuckups(data);
      setError(null);
    } catch (err) {
      setError('Failed to load fuckups. Make sure the backend is running.');
      console.error('Error fetching fuckups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFuckup = async (fuckup: AddFuckupRequest) => {
    try {
      setAdding(true);
      await fuckupApi.addFuckup(fuckup);
      await fetchFuckups(); // Refresh the list
    } catch (err) {
      setError('Failed to add fuckup. Please try again.');
      console.error('Error adding fuckup:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      // Check if already liked
      if (likeService.isLiked(id)) {
        return; // Already liked, do nothing
      }

      await fuckupApi.likeFuckup(id);
      
      // Save to localStorage
      likeService.addLikedFuckup(id);
      
      // Update liked count
      setLikedCount(likeService.getLikedFuckups().length);
      
      // Update the local state to reflect the new like count
      setFuckups(prev => 
        prev.map(fuckup => 
          fuckup.id === id 
            ? { ...fuckup, likes: fuckup.likes + 1 }
            : fuckup
        )
      );
    } catch (err) {
      setError('Failed to like fuckup. Please try again.');
      console.error('Error liking fuckup:', err);
    }
  };

  useEffect(() => {
    fetchFuckups();
    // Update liked count on component mount
    setLikedCount(likeService.getLikedFuckups().length);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>💥 Fuckup Board</h1>
        <p>Share your IT disasters and learn from others' mistakes</p>
        <div className="header-stats">
          <span>You've liked {likedCount} fuckup{likedCount !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <AddFuckupForm onSubmit={handleAddFuckup} isLoading={adding} />
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchFuckups} className="retry-button">
                Retry
              </button>
            </div>
          )}

          <div className="fuckups-section">
            <h2>Latest Fuckups</h2>
            
            {loading ? (
              <div className="loading">Loading fuckups...</div>
            ) : fuckups.length === 0 ? (
              <div className="empty-state">
                <p>No fuckups yet. Be the first to share your disaster! 🚀</p>
              </div>
            ) : (
              <div className="fuckups-list">
                {fuckups.map((fuckup) => (
                  <FuckupCard
                    key={fuckup.id}
                    fuckup={fuckup}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
