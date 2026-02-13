import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { careerAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './CareerDetail.css';

const CareerDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCareer = async () => {
    try {
      const response = await careerAPI.getCareerById(id);
      setCareer(response.data);
      
      if (user?.profileCompleted) {
        const gapResponse = await aiAPI.getSkillGap(response.data.careerName);
        setSkillGap(gapResponse.data);
      }
    } catch (error) {
      console.error('Failed to load career:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Loading career details...</div>
      </>
    );
  }

  if (!career) {
    return (
      <>
        <Navbar />
        <div className="error-container">Career not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="career-detail-container">
        <button onClick={() => navigate('/careers')} className="back-btn">
          ← Back to Careers
        </button>

        <div className="career-hero">
          <div className="career-title-section">
            <h1>{career.careerName}</h1>
            <span className="category-badge">{career.category}</span>
          </div>
          <p className="career-desc">{career.description}</p>
        </div>

        <div className="career-content">
          <div className="career-info-card">
            <h2>Career Overview</h2>
            <div className="info-grid">
              <div className="info-item">
                <div>
                  <h4>Average Salary</h4>
                  <p>{career.averageSalary}</p>
                </div>
              </div>
              <div className="info-item">
                <div>
                  <h4>Job Outlook</h4>
                  <p>{career.jobOutlook}</p>
                </div>
              </div>
            </div>
          </div>

          {skillGap && (
            <div className="skill-match-card">
              <h2>Your Skill Match</h2>
              <div className="match-circle-large">
                <svg width="200" height="200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="20"/>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="20"
                    strokeDasharray={`${skillGap.matchPercentage * 5.65} 565`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="105" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#333">
                    {skillGap.matchPercentage}%
                  </text>
                </svg>
              </div>
              <div className="match-stats">
                <div className="stat">
                  <span className="stat-value">{skillGap.matchingSkills.length}</span>
                  <span className="stat-label">Matching Skills</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{skillGap.missingSkills.length}</span>
                  <span className="stat-label">Skills to Learn</span>
                </div>
              </div>
            </div>
          )}

          <div className="skills-section">
            <h2>Required Skills</h2>
            <div className="skills-list">
              {career.requiredSkills.map((skill, idx) => {
                const hasSkill = skillGap?.matchingSkills.includes(skill);
                return (
                  <span
                    key={idx}
                    className={`skill-badge ${hasSkill ? 'has-skill' : 'missing-skill'}`}
                  >
                    {hasSkill && '✓ '}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {skillGap && skillGap.missingSkills.length > 0 && (
            <div className="missing-skills-section">
              <h2>Skills You Need to Develop</h2>
              <div className="missing-skills-list">
                {skillGap.missingSkills.map((skill, idx) => (
                  <div key={idx} className="missing-skill-item">
                    <span className="skill-name">{skill}</span>
                    <button
                      onClick={() => navigate('/chat', { state: { initialMessage: `How can I learn ${skill}?` } })}
                      className="learn-btn"
                    >
                      Get Learning Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="resources-section">
            <h2>Learning Resources</h2>
            <div className="resources-grid">
              {career.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <div className="resource-type-icon">
                    {resource.type === 'video' ? '🎥' : '📚'}
                  </div>
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type.toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerDetail;
