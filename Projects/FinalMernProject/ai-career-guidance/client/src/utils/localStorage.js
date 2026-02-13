// LocalStorage utility for managing user data
export const storage = {
  // Users management
  getUsers: () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  saveUsers: (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  clearCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  // User Profile
  saveUserProfile: (profile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  },
  
  getUserProfile: () => {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  },
  
  // Career Recommendations
  saveRecommendations: (recommendations) => {
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
    localStorage.setItem('recommendationsTimestamp', Date.now().toString());
  },
  
  getRecommendations: () => {
    const recommendations = localStorage.getItem('recommendations');
    const timestamp = localStorage.getItem('recommendationsTimestamp');
    
    // Check if recommendations are less than 24 hours old
    if (recommendations && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (age < oneDay) {
        return JSON.parse(recommendations);
      }
    }
    return null;
  },
  
  // Careers Data (Cache)
  saveCareers: (careers) => {
    localStorage.setItem('careersData', JSON.stringify(careers));
  },
  
  getCareers: () => {
    const careers = localStorage.getItem('careersData');
    return careers ? JSON.parse(careers) : [];
  },
  
  // Progress Tracking
  saveProgress: (progress) => {
    const existing = storage.getProgress();
    const updated = { ...existing, ...progress, lastUpdated: Date.now() };
    localStorage.setItem('userProgress', JSON.stringify(updated));
  },
  
  getProgress: () => {
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : {
      completedSkills: [],
      completedResources: [],
      notes: {},
      lastUpdated: Date.now()
    };
  },
  
  // Clear all data
  clearAll: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('users');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('recommendations');
    localStorage.removeItem('recommendationsTimestamp');
    localStorage.removeItem('careersData');
    localStorage.removeItem('userProgress');
  }
};
