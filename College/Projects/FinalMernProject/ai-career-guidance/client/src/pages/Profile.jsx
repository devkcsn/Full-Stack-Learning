import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    education: user?.education || '',
    interests: user?.interests || [],
    skills: user?.skills || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      education: user?.education || '',
      interests: user?.interests || [],
      skills: user?.skills || []
    });
    setEditing(false);
    setMessage('');
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-title">
            <h1>My Profile</h1>
            {!editing && (
              <button onClick={() => setEditing(true)} className="edit-btn">
                ✏️ Edit Profile
              </button>
            )}
          </div>
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-status">
              {user?.profileCompleted ? (
                <span className="status-badge complete">Profile Complete</span>
              ) : (
                <span className="status-badge incomplete">Profile Incomplete</span>
              )}
            </div>
          </div>

          <div className="profile-details">
            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Education Level</label>
                    <select
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
                </div>

                <div className="form-section">
                  <h3>Interests</h3>
                  <div className="add-item-container">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      placeholder="Add an interest"
                      disabled={loading}
                    />
                    <button type="button" onClick={addInterest} disabled={loading}>
                      Add
                    </button>
                  </div>
                  <div className="tags-container">
                    {formData.interests.map((interest, idx) => (
                      <span key={idx} className="tag">
                        {interest}
                        <button type="button" onClick={() => removeInterest(interest)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Skills</h3>
                  <div className="add-item-container">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill"
                      disabled={loading}
                    />
                    <button type="button" onClick={addSkill} disabled={loading}>
                      Add
                    </button>
                  </div>
                  <div className="tags-container">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="tag">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-section">
                  <h3>Education</h3>
                  <p>{user?.education || 'Not specified'}</p>
                </div>

                <div className="info-section">
                  <h3>Interests</h3>
                  {user?.interests && user.interests.length > 0 ? (
                    <div className="tags-container">
                      {user.interests.map((interest, idx) => (
                        <span key={idx} className="tag-view">{interest}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No interests added yet</p>
                  )}
                </div>

                <div className="info-section">
                  <h3>Skills</h3>
                  {user?.skills && user.skills.length > 0 ? (
                    <div className="tags-container">
                      {user.skills.map((skill, idx) => (
                        <span key={idx} className="tag-view">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No skills added yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
