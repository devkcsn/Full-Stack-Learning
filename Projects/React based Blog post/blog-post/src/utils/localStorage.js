// localStorage utility functions for blog posts
const STORAGE_KEY = 'blogPosts';

/**
 * Save posts to localStorage
 * @param {Array} posts - Array of blog posts to save
 * @returns {boolean} - Success status
 */
export const savePosts = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error saving posts to localStorage:', error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded! Please clear some space or delete old posts.');
    } else {
      alert('Unable to save posts. Please check your browser settings.');
    }
    return false;
  }
};

/**
 * Load posts from localStorage
 * @returns {Array} - Array of blog posts or empty array if none found
 */
export const loadPosts = () => {
  try {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      
      // Validate that it's an array
      if (Array.isArray(parsedPosts)) {
        return parsedPosts;
      } else {
        console.warn('Invalid posts data in localStorage, resetting...');
        clearPosts();
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
    
    // If there's corrupted data, clear it
    clearPosts();
    return [];
  }
};

/**
 * Clear all posts from localStorage
 * @returns {boolean} - Success status
 */
export const clearPosts = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing posts from localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} - Storage usage stats
 */
export const getStorageInfo = () => {
  try {
    const posts = loadPosts();
    const dataString = JSON.stringify(posts);
    const sizeInBytes = new Blob([dataString]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    
    return {
      postCount: posts.length,
      sizeInBytes,
      sizeInKB,
      sizeInMB,
      dataString: dataString.substring(0, 100) + '...' // Preview
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      postCount: 0,
      sizeInBytes: 0,
      sizeInKB: '0',
      sizeInMB: '0',
      dataString: ''
    };
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} - Whether localStorage is supported and available
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Export posts as JSON for backup
 * @returns {string} - JSON string of all posts
 */
export const exportPosts = () => {
  try {
    const posts = loadPosts();
    return JSON.stringify(posts, null, 2);
  } catch (error) {
    console.error('Error exporting posts:', error);
    return '[]';
  }
};

/**
 * Import posts from JSON string
 * @param {string} jsonString - JSON string containing posts data
 * @returns {boolean} - Success status
 */
export const importPosts = (jsonString) => {
  try {
    const posts = JSON.parse(jsonString);
    
    if (!Array.isArray(posts)) {
      throw new Error('Invalid data format: Expected an array of posts');
    }
    
    // Validate post structure
    const isValidPost = (post) => {
      return post && 
             typeof post.id === 'string' && 
             typeof post.title === 'string' && 
             typeof post.content === 'string' && 
             typeof post.date === 'string';
    };
    
    const validPosts = posts.filter(isValidPost);
    
    if (validPosts.length !== posts.length) {
      console.warn(`${posts.length - validPosts.length} invalid posts were skipped during import`);
    }
    
    return savePosts(validPosts);
  } catch (error) {
    console.error('Error importing posts:', error);
    alert('Error importing posts: ' + error.message);
    return false;
  }
};