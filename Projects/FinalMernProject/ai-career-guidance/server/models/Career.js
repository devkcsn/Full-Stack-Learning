const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  careerName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String
  }],
  averageSalary: {
    type: String,
    default: ''
  },
  jobOutlook: {
    type: String,
    default: ''
  },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'course', 'article', 'book'] }
  }],
  category: {
    type: String,
    default: 'Technology'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Career', careerSchema);
