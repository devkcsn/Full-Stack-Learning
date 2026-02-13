import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    education: user?.education || '',
    interests: user?.interests || [],
    skills: user?.skills || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.education) {
      setError('Please enter your education level');
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please add at least one interest');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>Complete Your Profile</h1>
          <p>Help us understand you better to provide personalized recommendations</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="education">Education Level *</label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select your education level</option>
              <option value="High School">High School</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Ph.D.">Ph.D.</option>
              <option value="Self-taught">Self-taught</option>
              <option value="Bootcamp">Bootcamp Graduate</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Interests * (What areas excite you?)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="e.g., Web Development, AI, Design"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addInterest}
                className="btn-primary"
                style={{ padding: '12px 20px', marginTop: 0 }}
                disabled={loading}
              >
                Add
              </button>
            </div>
            <div className="skill-input-container">
              {formData.interests.map((interest, index) => (
                <span key={index} className="skill-tag">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)}>×</button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Current Skills * (What can you do now?)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g., JavaScript, Python, Figma"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-primary"
                style={{ padding: '12px 20px', marginTop: 0 }}
                disabled={loading}
              >
                Add
              </button>
            </div>
            <div className="skill-input-container">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              marginTop: '10px'
            }}
            className="btn-primary"
            disabled={loading}
          >
            Skip for Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
