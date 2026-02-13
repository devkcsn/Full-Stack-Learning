const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');
const { authMiddleware } = require('./auth');

// MOCK AI CHAT - No OpenAI API Required
// This provides intelligent responses without needing OpenAI credits

// Get personalized career recommendations (simplified without AI)
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    console.log('📊 Recommendations request received for user:', req.userId);
    
    const user = await User.findById(req.userId);
    if (!user) {
      console.error('❌ User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.name, '| Skills:', user.skills.length, '| Interests:', user.interests.length);

    // Check if we have recent recommendations
    const recentRecommendation = await Recommendation.findOne({
      userId: user._id,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).populate('suggestedCareers.careerId');

    if (recentRecommendation) {
      console.log('✅ Returning cached recommendations');
      return res.json(recentRecommendation);
    }

    // Get all careers
    const allCareers = await Career.find();
    console.log('📚 Found', allCareers.length, 'careers in database');
    
    if (allCareers.length === 0) {
      console.error('❌ No careers found in database. Please run: node seed.js');
      return res.status(500).json({ 
        message: 'No careers available. Please seed the database first.',
        hint: 'Run: node seed.js' 
      });
    }
    
    // Simple matching algorithm
    const userSkills = user.skills.map(s => s.toLowerCase());
    const userInterests = user.interests.map(i => i.toLowerCase());
    
    const careerScores = allCareers.map(career => {
      let score = 0;
      const requiredSkills = career.requiredSkills.map(s => s.toLowerCase());
      
      // Match skills
      const matchingSkills = requiredSkills.filter(skill =>
        userSkills.some(userSkill =>
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      );
      score += (matchingSkills.length / requiredSkills.length) * 70;
      
      // Match interests
      if (userInterests.some(interest =>
        career.category.toLowerCase().includes(interest) ||
        career.careerName.toLowerCase().includes(interest)
      )) {
        score += 30;
      }
      
      return { career, score: Math.round(score), matchingSkills: matchingSkills.length };
    });
    
    const topCareers = careerScores.sort((a, b) => b.score - a.score).slice(0, 3);
    
    const suggestedCareers = topCareers.map(item => ({
      careerId: item.career._id,
      careerName: item.career.careerName,
      matchScore: item.score,
      reason: `Matches ${item.matchingSkills} of your skills${
        userInterests.some(i => item.career.category.toLowerCase().includes(i))
          ? ' and aligns with your interests'
          : ''
      }`
    }));
    
    // Find missing skills
    const allMissingSkills = new Map();
    topCareers.forEach(item => {
      const requiredSkills = item.career.requiredSkills.map(s => s.toLowerCase());
      requiredSkills.forEach(skill => {
        if (!userSkills.some(us => us.includes(skill) || skill.includes(us))) {
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
    
    const missingSkills = Array.from(allMissingSkills.values())
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        skill: item.skill,
        priority: item.count >= 3 ? 'high' : item.count >= 2 ? 'medium' : 'low',
        relatedCareers: item.relatedCareers
      }));
    
    // Create learning path
    const learningPath = missingSkills.slice(0, 5).map(item => {
      const relatedCareers = allCareers.filter(c =>
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
          estimatedTime: '1-2 months'
        });
      }
      
      return { skill: item.skill, resources };
    });
    
    const recommendation = new Recommendation({
      userId: user._id,
      suggestedCareers,
      missingSkills,
      learningPath
    });
    
    await recommendation.save();
    await recommendation.populate('suggestedCareers.careerId');
    
    console.log('✅ Generated recommendations:', {
      careers: suggestedCareers.length,
      missingSkills: missingSkills.length,
      learningPath: learningPath.length
    });
    
    res.json(recommendation);
  } catch (error) {
    console.error('❌ Recommendation error:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// Get skill gap analysis
router.post('/skill-gap', authMiddleware, async (req, res) => {
  try {
    const { careerName } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const career = await Career.findOne({ careerName });
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

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

    res.json({
      career: careerName,
      matchPercentage,
      totalRequired: requiredSkills.length,
      matchingSkills,
      missingSkills,
      resources: career.resources
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MOCK AI Chat - Context-aware responses without OpenAI
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    // Skill-related questions
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      const skillSuggestions = [
        'Cloud Computing (AWS, Azure, Google Cloud)',
        'Machine Learning and AI',
        'DevOps and CI/CD',
        'Full-Stack Development',
        'Cybersecurity',
        'Data Analysis and Visualization'
      ];
      response = `Based on your current skills in ${user.skills.join(', ') || 'technology'}, I recommend expanding your expertise. Here are some high-demand skills to consider:\n\n${skillSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich of these interests you most? I can provide specific learning resources!`;
    }
    
    // Career path questions
    else if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('path')) {
      response = `Great question about career paths! Given your background:\n\n📚 Education: ${user.education || 'Your field'}\n🎯 Interests: ${user.interests.join(', ') || 'Technology'}\n💪 Skills: ${user.skills.slice(0, 3).join(', ') || 'Your expertise'}\n\nI see several promising directions for you:\n\n1. **Software Development** - Build applications and systems\n2. **Data Science** - Analyze data and create insights\n3. **Cloud Architecture** - Design scalable cloud solutions\n4. **Product Management** - Bridge technology and business\n\nWould you like details about any specific career?`;
    }
    
    // Transition questions
    else if (lowerMessage.includes('transition') || lowerMessage.includes('change') || lowerMessage.includes('switch')) {
      response = `Career transitions are exciting opportunities! Here's my advice:\n\n✅ **Leverage Your Skills**: You already have ${user.skills.length || 'valuable'} skills that transfer well\n\n📝 **Action Plan**:\n1. Identify your target role\n2. Map skills gaps\n3. Build portfolio projects\n4. Network with professionals\n5. Consider certifications\n\n🎯 **Pro Tip**: Many skills are transferable! Your experience with ${user.skills[0] || 'technology'} is valuable in multiple fields.\n\nWhat specific field are you considering transitioning to?`;
    }
    
    // Learning resources
    else if (lowerMessage.includes('resource') || lowerMessage.includes('course') || lowerMessage.includes('tutorial')) {
      response = `Here are excellent learning resources tailored to your level:\n\n🎓 **Online Platforms**:\n- Coursera & edX (Structured courses with certificates)\n- Udemy (Affordable, practical courses)\n- Pluralsight (Tech-focused content)\n- freeCodeCamp (Free, project-based)\n\n📺 **Video Content**:\n- YouTube channels for ${user.skills[0] || 'programming'}\n- Technical conference talks\n\n📚 **Practice Platforms**:\n- LeetCode (Coding practice)\n- GitHub (Real projects)\n- Kaggle (Data science)\n\n💡 **My Recommendation**: Start with a structured course, then build projects to apply your learning. Which topic interests you most?`;
    }
    
    // Interview preparation
    else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      response = `Interview preparation tips for tech roles:\n\n📋 **Technical Prep**:\n1. Practice coding problems (LeetCode, HackerRank)\n2. Review fundamental concepts in ${user.skills[0] || 'your field'}\n3. Build a portfolio showcasing your work\n4. Prepare for system design questions\n\n💬 **Behavioral Prep**:\n- Use STAR method (Situation, Task, Action, Result)\n- Prepare stories demonstrating your skills\n- Research the company thoroughly\n\n🎯 **Mock Interviews**: Practice with peers or use platforms like Pramp\n\nWhat type of role are you interviewing for? I can give more specific advice!`;
    }
    
    // Salary/compensation
    else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('compensation')) {
      response = `Let's talk about compensation! 💰\n\n**Factors affecting salary**:\n- Experience level\n- Technical skills (especially ${user.skills.slice(0, 2).join(', ') || 'in-demand technologies'})\n- Location (remote vs on-site)\n- Company size and stage\n- Industry sector\n\n**Negotiation Tips**:\n1. Research market rates (use Glassdoor, Levels.fyi)\n2. Know your worth based on your skills\n3. Consider total compensation (equity, benefits)\n4. Always negotiate respectfully\n\n**High-paying skills** right now include Cloud Architecture, ML/AI, and Cybersecurity.\n\nWant advice on negotiating for a specific role?`;
    }
    
    // Remote work
    else if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
      response = `Remote work opportunities are abundant in tech! 🏡💻\n\n**Best Remote Career Paths**:\n- Software Development\n- Data Analysis/Science\n- Digital Marketing\n- UX/UI Design\n- Technical Writing\n\n**Finding Remote Jobs**:\n- Remote.co, We Work Remotely\n- FlexJobs, Remote OK\n- Company career pages (many now offer remote)\n\n**Tips for Success**:\n✅ Strong communication skills\n✅ Self-discipline and time management\n✅ Reliable home office setup\n✅ Proactive collaboration\n\nWith your skills in ${user.skills.join(', ') || 'technology'}, you're well-positioned for remote work!`;
    }
    
    // Default response
    else {
      response = `Thank you for your question! 👋\n\nAs your AI career counselor, I can help you with:\n\n🎯 **Career Path Guidance**\n💡 **Skill Development Advice**\n📚 **Learning Resources**\n💼 **Job Search Strategies**\n🎤 **Interview Preparation**\n💰 **Salary Negotiation**\n\n**About You**:\n- Education: ${user.education || 'Not specified'}\n- Interests: ${user.interests.join(', ') || 'Not specified'}\n- Skills: ${user.skills.join(', ') || 'Add skills to get personalized advice!'}\n\nAsk me anything specific about your career development!`;
    }

    res.json({
      reply: response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
});

module.exports = router;
