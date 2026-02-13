const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  suggestedCareers: [{
    careerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career'
    },
    careerName: String,
    matchScore: Number,
    reason: String
  }],
  missingSkills: [{
    skill: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    relatedCareers: [String]
  }],
  learningPath: [{
    skill: String,
    resources: [{
      title: String,
      url: String,
      type: String,
      estimatedTime: String
    }]
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
