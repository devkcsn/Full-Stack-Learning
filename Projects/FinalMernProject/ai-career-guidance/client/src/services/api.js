import axios from 'axios';
import { storage } from '../utils/localStorage';
import { careersData } from '../data/careers';

// API base URL - update this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = storage.getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API - Backend integration with fallback
export const authAPI = {
  register: async (data) => {
    try {
      // Try backend first
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      
      // Store token and user
      const userWithToken = { ...user, token };
      storage.setCurrentUser(userWithToken);
      
      return { data: { user: userWithToken } };
    } catch (error) {
      console.error('Backend register failed, using localStorage:', error);
      
      // Fallback to localStorage
      await delay(500);
      const users = storage.getUsers() || [];
      
      if (users.find(u => u.email === data.email)) {
        throw new Error('User already exists');
      }
      
      const user = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        education: '',
        interests: [],
        skills: [],
        profileCompleted: false,
        createdAt: new Date().toISOString()
      };
      
      users.push(user);
      storage.saveUsers(users);
      storage.setCurrentUser(user);
      
      return { data: { user: { ...user, password: undefined } } };
    }
  },
  
  login: async (data) => {
    try {
      // Try backend first
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      
      // Store token and user
      const userWithToken = { ...user, token };
      storage.setCurrentUser(userWithToken);
      
      return { data: { user: userWithToken } };
    } catch (error) {
      console.error('Backend login failed, using localStorage:', error);
      
      // Fallback to localStorage
      await delay(500);
      const users = storage.getUsers() || [];
      const user = users.find(u => u.email === data.email && u.password === data.password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      storage.setCurrentUser(user);
      return { data: { user: { ...user, password: undefined } } };
    }
  },
  
  getProfile: async () => {
    try {
      // Try backend first
      const response = await api.get('/auth/profile');
      const user = response.data;
      
      // Update local storage
      const currentUser = storage.getCurrentUser();
      const userWithToken = { ...user, token: currentUser?.token };
      storage.setCurrentUser(userWithToken);
      
      return { data: userWithToken };
    } catch (error) {
      console.error('Backend getProfile failed, using localStorage:', error);
      
      // Fallback to localStorage
      await delay(300);
      const user = storage.getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      return { data: { ...user, password: undefined } };
    }
  },
  
  updateProfile: async (data) => {
    try {
      // Try backend first
      const response = await api.put('/auth/profile', data);
      const user = response.data;
      
      // Update local storage
      const currentUser = storage.getCurrentUser();
      const userWithToken = { ...user, token: currentUser?.token };
      storage.setCurrentUser(userWithToken);
      
      return { data: userWithToken };
    } catch (error) {
      console.error('Backend updateProfile failed, using localStorage:', error);
      
      // Fallback to localStorage
      await delay(500);
      const users = storage.getUsers() || [];
      const currentUser = storage.getCurrentUser();
      
      if (!currentUser) throw new Error('Not authenticated');
      
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...users[userIndex],
        ...data,
        profileCompleted: !!(data.education && data.interests?.length > 0 && data.skills?.length > 0)
      };
      
      users[userIndex] = updatedUser;
      storage.saveUsers(users);
      storage.setCurrentUser(updatedUser);
      
      return { data: { ...updatedUser, password: undefined } };
    }
  }
};

// Career API - Backend integration with fallback
export const careerAPI = {
  getAllCareers: async () => {
    try {
      // Try backend first
      const response = await api.get('/careers');
      return { data: response.data };
    } catch (error) {
      console.error('Backend getAllCareers failed, using static data:', error);
      
      // Fallback to static data
      await delay(300);
      return { data: careersData };
    }
  },
  
  getCareerById: async (id) => {
    try {
      // Try backend first
      const response = await api.get(`/careers/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Backend getCareerById failed, using static data:', error);
      
      // Fallback to static data
      await delay(200);
      const career = careersData.find(c => c._id === id);
      if (!career) throw new Error('Career not found');
      return { data: career };
    }
  }
};

// AI API - Backend integration
export const aiAPI = {
  getRecommendations: async () => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check cache
    const cached = storage.getRecommendations();
    if (cached) return { data: cached };
    
    try {
      // Call backend API for recommendations
      const response = await api.get('/ai/recommendations');
      const recommendation = response.data;
      
      // Save to cache
      storage.saveRecommendations(recommendation);
      return { data: recommendation };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      
      // If backend fails, provide a fallback response
      if (error.response?.status === 500 || error.code === 'ERR_NETWORK') {
        // Generate basic recommendations based on user skills and interests
        const fallbackRecommendations = generateFallbackRecommendations(user);
        storage.saveRecommendations(fallbackRecommendations);
        return { data: fallbackRecommendations };
      }
      
      throw error;
    }
  },
  
  getSkillGap: async (careerName) => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    try {
      // Call backend API
      const response = await api.post('/ai/skill-gap', { careerName });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching skill gap:', error);
      
      // Fallback to local calculation
      const career = careersData.find(c => c.careerName === careerName);
      if (!career) throw new Error('Career not found');

      const userSkills = user.skills.map(s => s.toLowerCase());
      const requiredSkills = career.requiredSkills;
      
      const missingSkills = requiredSkills.filter(skill => 
        !userSkills.some(userSkill => 
          userSkill.includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill)
        )
      );

      const matchingSkills = requiredSkills.filter(skill =>
        userSkills.some(userSkill =>
          userSkill.includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill)
        )
      );

      const matchPercentage = Math.round((matchingSkills.length / requiredSkills.length) * 100);

      return {
        data: {
          career: careerName,
          matchPercentage,
          totalRequired: requiredSkills.length,
          matchingSkills,
          missingSkills,
          resources: career.resources
        }
      };
    }
  },
  
  chat: async (message, conversationHistory) => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    try {
      // Call backend API
      const response = await api.post('/ai/chat', {
        message,
        conversationHistory
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to connect to AI chat service. Please try again.');
    }
  }
};

// Fallback recommendation generator when backend is unavailable
function generateFallbackRecommendations(user) {
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const userInterests = (user.interests || []).map(i => i.toLowerCase());
  
  // Calculate match scores for each career
  const careerScores = careersData.map(career => {
    let score = 0;
    const requiredSkills = career.requiredSkills.map(s => s.toLowerCase());
    
    // Score based on matching skills (70% weight)
    const matchingSkills = requiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    );
    const skillScore = (matchingSkills.length / requiredSkills.length) * 70;
    score += skillScore;
    
    // Score based on interests (30% weight)
    const categoryMatch = userInterests.some(interest =>
      career.category.toLowerCase().includes(interest) ||
      career.careerName.toLowerCase().includes(interest)
    );
    if (categoryMatch) score += 30;
    
    return {
      career,
      score: Math.round(score),
      matchingSkills: matchingSkills.length,
      totalSkills: requiredSkills.length
    };
  });
  
  // Sort by score and get top 3
  const topCareers = careerScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  // Generate recommendations
  const suggestedCareers = topCareers.map((item) => ({
    careerId: item.career._id,
    careerName: item.career.careerName,
    matchScore: item.score,
    reason: `Matches ${item.matchingSkills} of ${item.totalSkills} required skills${
      userInterests.some(i => item.career.category.toLowerCase().includes(i))
        ? ' and aligns with your interests'
        : ''
    }`
  }));
  
  // Collect all missing skills
  const allMissingSkills = new Map();
  topCareers.forEach(item => {
    const requiredSkills = item.career.requiredSkills.map(s => s.toLowerCase());
    requiredSkills.forEach(skill => {
      if (!userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))) {
        if (!allMissingSkills.has(skill)) {
          allMissingSkills.set(skill, {
            skill: item.career.requiredSkills.find(s => s.toLowerCase() === skill),
            relatedCareers: [],
            count: 0
          });
        }
        const skillData = allMissingSkills.get(skill);
        skillData.relatedCareers.push(item.career.careerName);
        skillData.count++;
      }
    });
  });
  
  // Prioritize missing skills
  const missingSkills = Array.from(allMissingSkills.values())
    .sort((a, b) => b.count - a.count)
    .map(item => ({
      skill: item.skill,
      priority: item.count >= 3 ? 'high' : item.count >= 2 ? 'medium' : 'low',
      relatedCareers: item.relatedCareers
    }));
  
  // Create learning path for top missing skills
  const learningPath = missingSkills.slice(0, 5).map(item => {
    const relatedCareers = careersData.filter(c =>
      item.relatedCareers.includes(c.careerName)
    );
    
    const resources = [];
    relatedCareers.forEach(career => {
      career.resources.forEach(resource => {
        if (resources.length < 2) {
          resources.push({
            title: resource.title,
            url: resource.url,
            type: resource.type,
            estimatedTime: item.priority === 'high' ? '1-2 months' : '2-3 months'
          });
        }
      });
    });
    
    if (resources.length === 0) {
      resources.push({
        title: `Learn ${item.skill}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + ' tutorial')}`,
        type: 'video',
        estimatedTime: item.priority === 'high' ? '1-2 months' : '2-3 months'
      });
    }
    
    return {
      skill: item.skill,
      resources
    };
  });
  
  return {
    userId: user.id,
    suggestedCareers,
    missingSkills,
    learningPath,
    timestamp: new Date().toISOString(),
    source: 'fallback'
  };
}
