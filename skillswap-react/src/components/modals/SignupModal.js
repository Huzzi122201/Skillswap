import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { authAPI } from '../../services/api';
import './SignupModal.css';

const SignupModal = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    possessedSkills: [],
    requiredSkills: []
  });
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional domain validation
    const [localPart, domain] = email.split('@');
    
    // Check local part length (max 64 characters)
    if (localPart.length > 64) {
      return false;
    }

    // Check domain part length (max 255 characters)
    if (domain.length > 255) {
      return false;
    }

    // Check if domain has valid TLD
    const validTLDs = [
      'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
      'info', 'biz', 'name', 'pro', 'museum', 'coop',
      'aero', 'xxx', 'idv', 'mobi', 'asia', 'tel',
      'pub', 'ai', 'dev', 'io', 'co', 'me', 'tv'
    ];

    const tld = domain.split('.').pop().toLowerCase();
    if (!validTLDs.includes(tld)) {
      return false;
    }

    return true;
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(password);
  };

  const validateUsername = (username) => {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any existing errors for this field
    setErrors(prev => ({ ...prev, [name]: null, general: null }));
    
    // Real-time validation
    if (value.length > 0) {
      if (name === 'email' && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (name === 'password' && !validatePassword(value)) {
        setErrors(prev => ({ ...prev, password: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character' }));
      } else if (name === 'username' && !validateUsername(value)) {
        setErrors(prev => ({ ...prev, username: 'Username must be 3-20 characters long and can only contain letters, numbers, underscores, and hyphens' }));
      }
    }
  };

  const handleAddPossessedSkill = () => {
    if (newPossessedSkill.name) {
      setFormData(prev => ({
        ...prev,
        possessedSkills: [...prev.possessedSkills, { ...newPossessedSkill, id: Date.now() }]
      }));
      setNewPossessedSkill({
        name: '',
        proficiencyLevel: 'Beginner',
        yearsOfExperience: 0
      });
    }
  };

  const handleAddRequiredSkill = () => {
    if (newRequiredSkill.name) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, { ...newRequiredSkill, id: Date.now() }]
      }));
      setNewRequiredSkill({
        name: '',
        desiredLevel: 'Beginner',
        preferredLearningMethod: 'Online'
      });
    }
  };

  const handleRemovePossessedSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      possessedSkills: prev.possessedSkills.filter(skill => skill.id !== skillId)
    }));
  };

  const handleRemoveRequiredSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill.id !== skillId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      validateUsername(formData.username) &&
      validateEmail(formData.email) &&
      validatePassword(formData.password)
    ) {
      setIsSubmitting(true);
      try {
        // Format the skills data to match backend expectations
        const formattedData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          possessedSkills: formData.possessedSkills.map(skill => ({
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel,
            yearsOfExperience: skill.yearsOfExperience
          })),
          requiredSkills: formData.requiredSkills.map(skill => ({
            name: skill.name,
            desiredLevel: skill.desiredLevel,
            preferredLearningMethod: skill.preferredLearningMethod
          }))
        };

        await authAPI.register(formattedData);
        setFormData({
          username: '',
          email: '',
          password: '',
          possessedSkills: [],
          requiredSkills: []
        });
        setErrors({});
        alert('Registration successful! Please log in with your credentials.');
        closeModal();
        openModal('login');
      } catch (err) {
        const errorMessage = err.message || 'Registration failed';
        if (errorMessage.includes('Username already taken')) {
          setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
        } else if (errorMessage.includes('Email already in use')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (activeModal !== 'signup') return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-section">
            <h3>Skills I Can Teach</h3>
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
            <div className="skills-list">
              {formData.possessedSkills.map(skill => (
                <div key={skill.id} className="skill-tag">
                  {skill.name} ({skill.proficiencyLevel}, {skill.yearsOfExperience}y)
                  <button type="button" onClick={() => handleRemovePossessedSkill(skill.id)}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Skills I Want to Learn</h3>
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
            <div className="skills-list">
              {formData.requiredSkills.map(skill => (
                <div key={skill.id} className="skill-tag">
                  {skill.name} ({skill.desiredLevel}, {skill.preferredLearningMethod})
                  <button type="button" onClick={() => handleRemoveRequiredSkill(skill.id)}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="form-footer">
            Already have an account?{' '}
            <button 
              type="button" 
              className="link-button" 
              onClick={() => openModal('login')}
              disabled={isSubmitting}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupModal; 