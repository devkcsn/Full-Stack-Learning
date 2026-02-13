import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, careerAPI } from '../services/api';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    if (user && user.profileCompleted) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
    loadCareers();
  }, [user]);

  const loadCareers = async () => {
    try {
      const response = await careerAPI.getAllCareers();
      setCareers(response.data);
    } catch (error) {
      console.error('Failed to load careers:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await aiAPI.getRecommendations();
      console.log('Recommendations response:', response.data);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      let errorMessage = 'Failed to load recommendations. ';
      
      if (error.response?.status === 404) {
        errorMessage += 'User profile not found.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please check if MongoDB is running and careers are seeded.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Cannot connect to server. Make sure the backend is running on port 5000.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!user.profileCompleted) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="welcome-card">
            <h1>Welcome, {user.name}!</h1>
            <p>Complete your profile to get personalized career recommendations powered by AI.</p>
            <button onClick={() => navigate('/profile-setup')} className="btn-primary">
              Complete Profile Now
            </button>
          </div>
          
          {careers.length > 0 && (
            <div className="section">
              <h2>Explore Popular Careers</h2>
              <div className="career-grid">
                {careers.slice(0, 6).map((career) => (
                  <div key={career._id} className="career-card" onClick={() => navigate(`/career/${career._id}`)}>
                    <h3>{career.careerName}</h3>
                    <p>{career.description.substring(0, 100)}...</p>
                    <div className="career-meta">
                      <span className="tag">{career.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const skillsChartData = {
    labels: ['Skills You Have', 'Skills Needed'],
    datasets: [{
      data: [
        user.skills?.length || 0,
        recommendations?.missingSkills?.length || 0
      ],
      backgroundColor: ['#3b82f6', '#94a3b8'],
      borderWidth: 0
    }]
  };

  const careerMatchData = recommendations?.suggestedCareers?.length > 0 ? {
    labels: recommendations.suggestedCareers.map(c => c.careerName),
    datasets: [{
      label: 'Match Score',
      data: recommendations.suggestedCareers.map(c => c.matchScore),
      backgroundColor: 'rgba(102, 126, 234, 0.8)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 2
    }]
  } : null;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your personalized career guidance dashboard</p>
        </div>

        {loading && (
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Analyzing your profile and generating recommendations...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button onClick={loadRecommendations} className="btn-primary">Retry</button>
          </div>
        )}

        {!loading && recommendations && (
          <>
            {/* Career Recommendations */}
            <div className="section">
              <h2>Your Top Career Matches</h2>
              <div className="career-recommendations">
                {recommendations.suggestedCareers.map((career, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rank-badge">#{index + 1}</div>
                    <h3>{career.careerName}</h3>
                    <div className="match-score">
                      <div className="score-circle">{career.matchScore}%</div>
                      <span>Match Score</span>
                    </div>
                    <p className="match-reason">{career.reason}</p>
                    <button
                      onClick={() => career.careerId && navigate(`/career/${career.careerId}`)}
                      className="btn-secondary"
                    >
                      Explore Career
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-card">
                <h3>Skills Overview</h3>
                <div className="chart-container">
                  <Doughnut data={skillsChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              
              {careerMatchData && (
                <div className="chart-card">
                  <h3>Career Match Scores</h3>
                  <div className="chart-container">
                    <Bar
                      data={careerMatchData}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Learning Path */}
            <div className="section">
              <h2>Recommended Learning Path</h2>
              <div className="learning-path">
                {recommendations.learningPath.map((item, index) => (
                  <div key={index} className="learning-card">
                    <h3>{item.skill}</h3>
                    <div className="resources">
                      {item.resources.map((resource, rIndex) => (
                        <a
                          key={rIndex}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          <div>
                            <h4>{resource.title}</h4>
                            <p>{resource.estimatedTime || 'Self-paced'}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
