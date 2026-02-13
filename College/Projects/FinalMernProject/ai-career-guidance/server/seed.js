const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('./models/Career');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-guidance')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const careers = [
  {
    careerName: 'Full Stack Developer',
    description: 'Build complete web applications using frontend and backend technologies. Work on databases, servers, systems engineering, and client-side development.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'REST APIs', 'Git'],
    averageSalary: '$85,000 - $130,000',
    jobOutlook: 'Excellent - 25% growth expected',
    category: 'Web Development',
    resources: [
      { title: 'Full Stack Web Development Course', url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk', type: 'video' },
      { title: 'The Complete Web Developer Course', url: 'https://www.coursera.org/specializations/full-stack-react', type: 'course' }
    ]
  },
  {
    careerName: 'Data Scientist',
    description: 'Analyze complex data to help companies make better decisions. Use statistics, machine learning, and programming to extract insights from data.',
    requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'TensorFlow'],
    averageSalary: '$95,000 - $150,000',
    jobOutlook: 'Excellent - 35% growth expected',
    category: 'Data Science',
    resources: [
      { title: 'Data Science Full Course', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', type: 'video' },
      { title: 'IBM Data Science Professional Certificate', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', type: 'course' }
    ]
  },
  {
    careerName: 'UI/UX Designer',
    description: 'Create intuitive and visually appealing user interfaces. Focus on user experience, interaction design, and visual design principles.',
    requiredSkills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping', 'HTML', 'CSS', 'Design Thinking'],
    averageSalary: '$70,000 - $115,000',
    jobOutlook: 'Very Good - 15% growth expected',
    category: 'Design',
    resources: [
      { title: 'UI/UX Design Tutorial', url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', type: 'video' },
      { title: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', type: 'course' }
    ]
  },
  {
    careerName: 'Mobile App Developer',
    description: 'Design and build applications for mobile devices. Work with iOS, Android, or cross-platform frameworks to create engaging mobile experiences.',
    requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Mobile UI Design', 'REST APIs', 'Git', 'App Store Deployment'],
    averageSalary: '$80,000 - $135,000',
    jobOutlook: 'Excellent - 22% growth expected',
    category: 'Mobile Development',
    resources: [
      { title: 'React Native Full Course', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', type: 'video' },
      { title: 'iOS & Swift Complete Course', url: 'https://www.coursera.org/specializations/app-development', type: 'course' }
    ]
  },
  {
    careerName: 'DevOps Engineer',
    description: 'Bridge the gap between development and operations. Automate and streamline software development and deployment processes.',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Terraform', 'Jenkins', 'Git', 'Python'],
    averageSalary: '$95,000 - $145,000',
    jobOutlook: 'Excellent - 20% growth expected',
    category: 'Cloud & DevOps',
    resources: [
      { title: 'DevOps Complete Course', url: 'https://www.youtube.com/watch?v=hQcFE0RD0cQ', type: 'video' },
      { title: 'AWS Certified DevOps Engineer', url: 'https://www.coursera.org/learn/aws-certified-devops-engineer', type: 'course' }
    ]
  },
  {
    careerName: 'Machine Learning Engineer',
    description: 'Design and implement machine learning applications. Build predictive models and deploy ML systems at scale.',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Neural Networks', 'SQL', 'Cloud Platforms', 'MLOps'],
    averageSalary: '$110,000 - $165,000',
    jobOutlook: 'Excellent - 40% growth expected',
    category: 'Artificial Intelligence',
    resources: [
      { title: 'Machine Learning Course by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
      { title: 'PyTorch for Deep Learning', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', type: 'video' }
    ]
  },
  {
    careerName: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats. Monitor networks, investigate security breaches, and implement security measures.',
    requiredSkills: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Linux', 'Python', 'Security Tools', 'Risk Assessment'],
    averageSalary: '$85,000 - $135,000',
    jobOutlook: 'Excellent - 35% growth expected',
    category: 'Cybersecurity',
    resources: [
      { title: 'Cybersecurity Full Course', url: 'https://www.youtube.com/watch?v=U_P23SqJaDc', type: 'video' },
      { title: 'Google Cybersecurity Certificate', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', type: 'course' }
    ]
  },
  {
    careerName: 'Cloud Architect',
    description: 'Design and oversee cloud computing strategies. Plan cloud infrastructure, ensure security, and optimize cloud resources.',
    requiredSkills: ['AWS', 'Azure', 'Google Cloud', 'Cloud Architecture', 'Microservices', 'Containerization', 'Networking', 'Security', 'DevOps'],
    averageSalary: '$120,000 - $175,000',
    jobOutlook: 'Excellent - 30% growth expected',
    category: 'Cloud & DevOps',
    resources: [
      { title: 'AWS Cloud Architect Tutorial', url: 'https://www.youtube.com/watch?v=k1RI5locZE4', type: 'video' },
      { title: 'AWS Solutions Architect Course', url: 'https://www.coursera.org/learn/aws-certified-solutions-architect-associate', type: 'course' }
    ]
  },
  {
    careerName: 'Product Manager',
    description: 'Guide product development from conception to launch. Work with cross-functional teams to build products that users love.',
    requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Communication', 'Roadmap Planning', 'Stakeholder Management', 'SQL'],
    averageSalary: '$100,000 - $160,000',
    jobOutlook: 'Very Good - 18% growth expected',
    category: 'Product Management',
    resources: [
      { title: 'Product Management Course', url: 'https://www.youtube.com/watch?v=2zfrPMuV9lM', type: 'video' },
      { title: 'Digital Product Management', url: 'https://www.coursera.org/specializations/product-management', type: 'course' }
    ]
  },
  {
    careerName: 'Frontend Developer',
    description: 'Create engaging and responsive user interfaces for web applications. Focus on HTML, CSS, JavaScript and modern frameworks.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Responsive Design', 'Webpack', 'Git', 'TypeScript'],
    averageSalary: '$75,000 - $125,000',
    jobOutlook: 'Very Good - 20% growth expected',
    category: 'Web Development',
    resources: [
      { title: 'Frontend Developer Course', url: 'https://www.youtube.com/watch?v=zJSY8tbf_ys', type: 'video' },
      { title: 'React - The Complete Guide', url: 'https://www.coursera.org/specializations/meta-react-native', type: 'course' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Check if careers already exist
    const count = await Career.countDocuments();
    
    if (count > 0) {
      console.log('Database already has careers. Clearing...');
      await Career.deleteMany({});
    }

    // Insert careers
    await Career.insertMany(careers);
    console.log(`✅ Successfully seeded ${careers.length} careers!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
