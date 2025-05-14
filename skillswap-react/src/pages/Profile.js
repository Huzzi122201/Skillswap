import React, { useState, useEffect } from 'react';
import { FaEdit, FaUpload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import '../styles/profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPossessedSkill, setNewPossessedSkill] = useState({
    name: '',
    proficiencyLevel: 'Beginner',
    yearsOfExperience: 0
  });
  const [newRequiredSkill, setNewRequiredSkill] = useState({
    name: '',
    desiredLevel: 'Beginner',
    preferredLearningMethod: 'Online'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          const data = await profileService.getProfile();
          setProfileData(data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await profileService.updateProfile({
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        location: profileData.location,
        possessedSkills: profileData.possessedSkills.map(skill => ({
          skillId: skill.skillId,
          name: skill.name,
          proficiencyLevel: skill.proficiencyLevel,
          yearsOfExperience: skill.yearsOfExperience,
          category: skill.category || 'Other',
          description: skill.description || ''
        })),
        requiredSkills: profileData.requiredSkills.map(skill => ({
          skillId: skill.skillId,
          name: skill.name,
          desiredLevel: skill.desiredLevel,
          preferredLearningMethod: skill.preferredLearningMethod,
          category: skill.category || 'Other',
          description: skill.description || ''
        }))
      });

      if (response.profile) {
        setProfileData(response.profile);
        setEditMode(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data);
        setEditMode(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to reset profile data');
      }
    };
    fetchProfile();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        const response = await profileService.updateProfilePicture(formData);
        setProfileData({ ...profileData, avatar: response.profilePicture });
      } catch (err) {
        setError('Failed to update profile picture');
        console.error('Error updating profile picture:', err);
      }
    }
  };

  const handleAddPossessedSkill = async () => {
    if (newPossessedSkill.name) {
      try {
        const response = await profileService.addSkill('possessed', {
          name: newPossessedSkill.name,
          proficiencyLevel: newPossessedSkill.proficiencyLevel,
          yearsOfExperience: newPossessedSkill.yearsOfExperience,
          category: 'Other'
        });
        
        if (response.profile && response.profile.possessedSkills) {
          setProfileData(prevData => ({
            ...prevData,
            possessedSkills: response.profile.possessedSkills.map(skill => ({
              ...skill,
              name: skill.name || newPossessedSkill.name
            }))
          }));
          
          setNewPossessedSkill({
            name: '',
            proficiencyLevel: 'Beginner',
            yearsOfExperience: 0
          });
        }
      } catch (err) {
        setError('Failed to add skill');
        console.error('Error adding skill:', err);
      }
    }
  };

  const handleAddRequiredSkill = async () => {
    if (newRequiredSkill.name) {
      try {
        const response = await profileService.addSkill('required', {
          name: newRequiredSkill.name,
          desiredLevel: newRequiredSkill.desiredLevel,
          preferredLearningMethod: newRequiredSkill.preferredLearningMethod,
          category: 'Other'
        });
        
        if (response.profile && response.profile.requiredSkills) {
          setProfileData(prevData => ({
            ...prevData,
            requiredSkills: response.profile.requiredSkills.map(skill => ({
              ...skill,
              name: skill.name || newRequiredSkill.name
            }))
          }));
          
          setNewRequiredSkill({
            name: '',
            desiredLevel: 'Beginner',
            preferredLearningMethod: 'Online'
          });
        }
      } catch (err) {
        setError('Failed to add skill');
        console.error('Error adding skill:', err);
      }
    }
  };

  const handleRemoveSkill = async (type, skillId) => {
    try {
      await profileService.deleteSkill(type, skillId);
      const skillsKey = type === 'possessed' ? 'possessedSkills' : 'requiredSkills';
      setProfileData(prevData => ({
        ...prevData,
        [skillsKey]: prevData[skillsKey].filter(skill => skill._id !== skillId)
      }));
    } catch (err) {
      setError(`Failed to remove ${type} skill`);
      console.error('Error removing skill:', err);
    }
  };

  if (!currentUser) {
    return <div className="error">Please log in to view your profile</div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!profileData) {
    return <div className="error">No profile data available</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {editMode ? (
              <div className="avatar-upload">
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-input" className="avatar-upload-label">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      {profileData.name ? profileData.name.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                  <div className="upload-overlay">
                    <FaUpload />
                  </div>
                </label>
              </div>
            ) : (
              profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : ''}
                </div>
              )
            )}
          </div>
          <div className="profile-title">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={profileData.username || ''}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="edit-input"
                  placeholder="Username"
                />
                <input
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="edit-input"
                  placeholder="Email"
                  disabled
                />
              </>
            ) : (
              <>
                <h1>{profileData.username || 'Username not set'}</h1>
                {profileData.name && <p className="user-name">{profileData.name}</p>}
                <p className="user-email">{profileData.email}</p>
              </>
            )}
          </div>
        </div>
        <div className="profile-actions">
          {!editMode ? (
            <button className="edit-btn" onClick={handleEdit}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Title</label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                />
              ) : (
                <p>{profileData.title}</p>
              )}
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{profileData.email}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              ) : (
                <p>{profileData.location}</p>
              )}
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{new Date(profileData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3>Bio</h3>
          {editMode ? (
            <textarea
              className="bio-textarea"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          ) : (
            <p className="bio">{profileData.bio}</p>
          )}
        </section>

        <section className="profile-section">
          <h3>Skills I Can Teach</h3>
          {editMode && (
            <div className="skill-input-group">
              <input
                type="text"
                placeholder="Skill name"
                value={newPossessedSkill.name}
                onChange={(e) => setNewPossessedSkill({
                  ...newPossessedSkill,
                  name: e.target.value
                })}
              />
              <select
                value={newPossessedSkill.proficiencyLevel}
                onChange={(e) => setNewPossessedSkill({
                  ...newPossessedSkill,
                  proficiencyLevel: e.target.value
                })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <input
                type="number"
                placeholder="Years of experience"
                value={newPossessedSkill.yearsOfExperience}
                onChange={(e) => setNewPossessedSkill({
                  ...newPossessedSkill,
                  yearsOfExperience: parseInt(e.target.value) || 0
                })}
              />
              <button type="button" onClick={handleAddPossessedSkill}>Add</button>
            </div>
          )}
          <div className="skills-grid">
            {profileData.possessedSkills.map((skill) => (
              <div key={skill._id} className="skill-card">
                <h4>{skill.name}</h4>
                <p>Proficiency: {skill.proficiencyLevel}</p>
                <p>Experience: {skill.yearsOfExperience} years</p>
                {skill.description && <p>Description: {skill.description}</p>}
                {skill.category && <p>Category: {skill.category}</p>}
                {editMode && (
                  <button
                    className="remove-skill-btn"
                    onClick={() => handleRemoveSkill('possessed', skill._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h3>Skills I Want to Learn</h3>
          {editMode && (
            <div className="skill-input-group">
              <input
                type="text"
                placeholder="Skill name"
                value={newRequiredSkill.name}
                onChange={(e) => setNewRequiredSkill({
                  ...newRequiredSkill,
                  name: e.target.value
                })}
              />
              <select
                value={newRequiredSkill.desiredLevel}
                onChange={(e) => setNewRequiredSkill({
                  ...newRequiredSkill,
                  desiredLevel: e.target.value
                })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={newRequiredSkill.preferredLearningMethod}
                onChange={(e) => setNewRequiredSkill({
                  ...newRequiredSkill,
                  preferredLearningMethod: e.target.value
                })}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
                <option value="Both">Both</option>
              </select>
              <button type="button" onClick={handleAddRequiredSkill}>Add</button>
            </div>
          )}
          <div className="skills-grid">
            {profileData.requiredSkills.map((skill) => (
              <div key={skill._id} className="skill-card">
                <h4>{skill.name}</h4>
                <p>Desired Level: {skill.desiredLevel}</p>
                <p>Learning Method: {skill.preferredLearningMethod}</p>
                {skill.description && <p>Description: {skill.description}</p>}
                {skill.category && <p>Category: {skill.category}</p>}
                {editMode && (
                  <button
                    className="remove-skill-btn"
                    onClick={() => handleRemoveSkill('required', skill._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {profileData.certifications.length > 0 && (
          <section className="profile-section">
            <h3>Certifications</h3>
            <div className="certifications-grid">
              {profileData.certifications.map((cert, index) => (
                <div key={cert._id || index} className="certification-card">
                  <h4>{cert.name}</h4>
                  <p>Issuer: {cert.issuer}</p>
                  <p>Date: {new Date(cert.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile; 