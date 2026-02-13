const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const User = require('../models/User');
const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');
const { authMiddleware } = require('./auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get personalized career recommendations
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if we have recent recommendations (less than 24 hours old)
    const recentRecommendation = await Recommendation.findOne({
      userId: user._id,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).populate('suggestedCareers.careerId');

    if (recentRecommendation) {
      return res.json(recentRecommendation);
    }

    // Get all careers
    const allCareers = await Career.find();

    // Use OpenAI to analyze and recommend careers
    const prompt = `
You are a career guidance AI. Based on the following user profile, recommend the top 3 most suitable careers and identify skill gaps.

User Profile:
- Education: ${user.education || 'Not specified'}
- Interests: ${user.interests.join(', ') || 'Not specified'}
- Current Skills: ${user.skills.join(', ') || 'None'}

Available Careers:
${allCareers.map(c => `- ${c.careerName}: Requires ${c.requiredSkills.join(', ')}`).join('\n')}

Please provide:
1. Top 3 career recommendations with match scores (0-100) and reasons
2. Missing skills for each recommended career (prioritized as high, medium, or low)
3. A learning path suggestion for the most critical skills

Format your response as JSON:
{
  "suggestedCareers": [
    {
      "careerName": "Career Name",
      "matchScore": 85,
      "reason": "Why this career matches"
    }
  ],
  "missingSkills": [
    {
      "skill": "Skill Name",
      "priority": "high",
      "relatedCareers": ["Career 1", "Career 2"]
    }
  ],
  "learningPath": [
    {
      "skill": "Skill Name",
      "estimatedTime": "2-3 months",
      "prerequisites": ["Skill 1", "Skill 2"]
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional career counselor with expertise in technology careers. Provide accurate, helpful career guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // Match career names to career IDs and add resources
    const suggestedCareersWithDetails = aiResponse.suggestedCareers.map(suggested => {
      const career = allCareers.find(c => 
        c.careerName.toLowerCase() === suggested.careerName.toLowerCase()
      );
      return {
        careerId: career?._id,
        careerName: suggested.careerName,
        matchScore: suggested.matchScore,
        reason: suggested.reason
      };
    });

    // Create learning path with resources
    const learningPathWithResources = await Promise.all(
      aiResponse.learningPath.map(async (item) => {
        // Find resources from related careers
        const relatedCareers = allCareers.filter(career =>
          career.requiredSkills.some(skill => 
            skill.toLowerCase().includes(item.skill.toLowerCase()) ||
            item.skill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        const resources = [];
        relatedCareers.forEach(career => {
          career.resources.forEach(resource => {
            if (resources.length < 3) {
              resources.push({
                title: resource.title,
                url: resource.url,
                type: resource.type,
                estimatedTime: item.estimatedTime
              });
            }
          });
        });

        // Add generic learning resources if none found
        if (resources.length === 0) {
          resources.push({
            title: `Learn ${item.skill}`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + ' tutorial')}`,
            type: 'video',
            estimatedTime: item.estimatedTime
          });
        }

        return {
          skill: item.skill,
          resources
        };
      })
    );

    // Save recommendation to database
    const recommendation = new Recommendation({
      userId: user._id,
      suggestedCareers: suggestedCareersWithDetails,
      missingSkills: aiResponse.missingSkills,
      learningPath: learningPathWithResources
    });

    await recommendation.save();
    await recommendation.populate('suggestedCareers.careerId');

    res.json(recommendation);
  } catch (error) {
    console.error('AI Recommendation error:', error);
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

// Chat with AI career counselor
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        message: 'OpenAI API key is not configured. Please add a valid API key to the .env file.',
        error: 'OPENAI_API_KEY_MISSING'
      });
    }

    const userContext = `
User Profile:
- Name: ${user.name}
- Education: ${user.education || 'Not specified'}
- Interests: ${user.interests.join(', ') || 'Not specified'}
- Current Skills: ${user.skills.join(', ') || 'None'}
`;

    const messages = [
      {
        role: "system",
        content: `You are a professional career guidance counselor specializing in technology careers. You provide personalized advice based on the user's profile. Be encouraging, specific, and actionable in your recommendations.\n\n${userContext}`
      },
      ...conversationHistory,
      {
        role: "user",
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8,
      max_tokens: 500
    });

    const aiReply = completion.choices[0].message.content;

    res.json({
      reply: aiReply,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Provide specific error messages
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        message: 'Invalid OpenAI API key. Please check your API key configuration.',
        error: 'INVALID_API_KEY'
      });
    }
    
    if (error.code === 'insufficient_quota') {
      return res.status(500).json({ 
        message: 'OpenAI API quota exceeded. Please check your OpenAI account billing.',
        error: 'QUOTA_EXCEEDED'
      });
    }
    
    res.status(500).json({ 
      message: 'Error processing chat. Please try again later.', 
      error: error.message 
    });
  }
});

module.exports = router;
