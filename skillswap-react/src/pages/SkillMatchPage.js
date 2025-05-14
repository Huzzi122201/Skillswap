import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../services/matchService';
import '../styles/SkillMatchPage.css';

const SkillMatchPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('teach');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const matchesData = activeTab === 'teach' 
          ? await matchService.getTeachingMatches()
          : await matchService.getLearningMatches();
        console.log('Matches data:', matchesData); // Debug log
        setMatches(matchesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!currentUser) {
    return <div className="error-message">Please log in to view your matches</div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="skill-match-page">
      <header className="page-header">
        <h1>Skill Match</h1>
        <p>Connect with peers to teach and learn new skills</p>
      </header>

      <div className="match-tabs">
        <button
          className={`tab-btn ${activeTab === 'teach' ? 'active' : ''}`}
          onClick={() => handleTabChange('teach')}
        >
          Teaching Matches
        </button>
        <button
          className={`tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
          onClick={() => handleTabChange('learn')}
        >
          Learning Matches
        </button>
      </div>

      <section className="matches-grid">
        {matches.length === 0 ? (
          <div className="no-matches">
            <p>No {activeTab === 'teach' ? 'teaching' : 'learning'} matches found.</p>
          </div>
        ) : (
          matches.map(match => {
            if (!match) return null;
            
            // Get the populated user object and handle both possible field names
            const otherUser = activeTab === 'teach' 
              ? (match.learnerId || match.learner)
              : (match.teacherId || match.teacher);

            if (!otherUser || typeof otherUser !== 'object') {
              console.error('Invalid user data in match:', match);
              return null;
            }

            const skill = activeTab === 'teach' ? match.skillToTeach : match.skillToLearn;
            const experience = activeTab === 'teach' ? match.teacherExperience : null;
            const goals = activeTab === 'learn' ? match.learnerGoals : null;

            return (
              <div key={match._id} className="match-card">
                <div className="user-info">
                  <div className="user-details">
                    <h3>{otherUser.username || `User ${match._id.substring(0, 4)}`}</h3>
                    <p className="user-title">
                      {otherUser.rating ? `Rating: ${otherUser.rating.toFixed(1)}★` : 'New Member'}
                    </p>
                  </div>
                </div>
                
                <div className="skill-info">
                  <div className="info-item">
                    <label>Skill</label>
                    <span>{skill || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>Location</label>
                    <span>{match.preferredLocation || 'Not specified'}</span>
                  </div>
                  {experience && (
                    <>
                      <div className="info-item">
                        <label>Experience</label>
                        <span>{experience.years} years - {experience.proficiencyLevel}</span>
                      </div>
                      <div className="info-item">
                        <label>Teaching Approach</label>
                        <span>{experience.description}</span>
                      </div>
                    </>
                  )}
                  {goals && (
                    <>
                      <div className="info-item">
                        <label>Learning Goals</label>
                        <span>Target Level: {goals.targetLevel}</span>
                      </div>
                      <div className="info-item">
                        <label>Time Commitment</label>
                        <span>{goals.timeCommitment}</span>
                      </div>
                      <div className="info-item">
                        <label>Learning Objectives</label>
                        <span>{goals.description}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="match-actions">
                  <button className="action-btn primary">Message</button>
                  <button className="action-btn secondary">View Profile</button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default SkillMatchPage; 