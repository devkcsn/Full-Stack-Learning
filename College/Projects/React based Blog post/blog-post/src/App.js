import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import PostForm from './PostForm';
import PostList from './PostList';
import Modal from './Modal';

const STORAGE_KEY = 'blogPosts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  // Reset animation state after animation completes
  useEffect(() => {
    if (isModalAnimating) {
      const timer = setTimeout(() => {
        setIsModalAnimating(false);
      }, 600); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [isModalAnimating]);

  // Handle modal closing
  const handleModalClose = () => {
    setIsModalAnimating(false);
    setIsModalOpen(false);
  };

  // Load posts from localStorage on component mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      
      if (savedPosts && savedPosts !== 'undefined') {
        const parsedPosts = JSON.parse(savedPosts);
        
        if (Array.isArray(parsedPosts)) {
          setPosts(parsedPosts);
        }
      }
    } catch (error) {
      console.error('Error loading posts from localStorage:', error);
      setStorageWarning(true);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save posts to localStorage whenever posts change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save on initial load
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
      setStorageWarning(true);
      
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded! Please clear some space or delete old posts.');
      }
    }
  }, [posts, isLoaded]);

  const handleAddPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsModalOpen(false); // Close modal after adding post
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
  };

  const handleClearAllPosts = () => {
    if (window.confirm('Are you sure you want to delete ALL posts? This cannot be undone!')) {
      setPosts([]);
      localStorage.removeItem(STORAGE_KEY);
      setStorageWarning(false);
      console.log('All posts cleared from localStorage');
    }
  };



  return (
    <div className="app">
      <Header />
      
      {/* Storage Warning */}
      {storageWarning && (
        <div className="storage-warning">
          <div className="container">
            <div className="warning-content">
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">
                Unable to save posts to local storage. Your posts may not be saved when you refresh the page.
              </span>
              <button 
                className="warning-close-btn"
                onClick={() => setStorageWarning(false)}
                aria-label="Close warning"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="main-content">
        <div className="container">
          {/* Storage Info & Controls */}
          {posts.length > 0 && (
            <div className="storage-info">
              <div className="storage-stats">
                <span className="posts-count">{posts.length} posts saved locally</span>
              </div>
              <div className="storage-actions">
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAllPosts}
                  title="Clear all posts"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          <PostList posts={posts} onDeletePost={handleDeletePost} />
        </div>
      </main>
      
      {/* Floating Plus Button */}
      <button 
        className="floating-plus-btn" 
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          setButtonPosition({ x: centerX, y: centerY });
          setIsModalAnimating(true);
          setIsModalOpen(true);
        }}
        aria-label="Add new blog post"
      >
        +
      </button>
      
      {/* Modal with PostForm */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        title="Create New Blog Post"
        isAnimating={isModalAnimating}
        buttonPosition={buttonPosition}
      >
        <PostForm onAddPost={handleAddPost} />
      </Modal>
    </div>
  );
}
