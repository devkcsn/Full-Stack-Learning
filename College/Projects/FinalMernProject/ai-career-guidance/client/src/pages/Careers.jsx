import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Careers.css';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const response = await careerAPI.getAllCareers();
      setCareers(response.data);
    } catch (error) {
      console.error('Failed to load careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(careers.map(c => c.category))];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.careerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || career.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="careers-container">
        <div className="careers-header">
          <h1>Explore Tech Careers</h1>
          <p>Discover amazing career opportunities in technology</p>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search careers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading careers...</div>
        ) : (
          <div className="careers-grid">
            {filteredCareers.map(career => (
              <div
                key={career._id}
                className="career-card-full"
                onClick={() => navigate(`/career/${career._id}`)}
              >
                <div className="career-header">
                  <h3>{career.careerName}</h3>
                  <span className="category-tag">{career.category}</span>
                </div>
                
                <p className="career-description">{career.description}</p>
                
                <div className="career-details">
                  <div className="detail-item">
                    <strong>Salary:</strong>
                    <span>{career.averageSalary}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Outlook:</strong>
                    <span>{career.jobOutlook}</span>
                  </div>
                </div>
                
                <div className="skills-preview">
                  <strong>Required Skills:</strong>
                  <div className="skills-tags">
                    {career.requiredSkills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="skill-tag-small">{skill}</span>
                    ))}
                    {career.requiredSkills.length > 5 && (
                      <span className="skill-tag-small more">+{career.requiredSkills.length - 5} more</span>
                    )}
                  </div>
                </div>
                
                <button className="view-details-btn">View Details →</button>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCareers.length === 0 && (
          <div className="no-results">
            <h3>No careers found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Careers;
