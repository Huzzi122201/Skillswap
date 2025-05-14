import React, { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { api } from '../services/api';
import '../styles/ReviewPage.css';

const ReviewPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [matches, setMatches] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    feedback: '',
    skillTaught: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchesResponse, reviewsResponse] = await Promise.all([
          api.get('/matches/my-matches'),
          reviewService.getMyReviews()
        ]);
        setMatches(matchesResponse.data);
        setReviews(reviewsResponse);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitReview = async (matchId) => {
    try {
      const response = await reviewService.createReview({
        matchId,
        rating: newReview.rating,
        feedback: newReview.feedback,
        skillTaught: newReview.skillTaught
      });

      // Update reviews list
      setReviews([...reviews, response]);
      
      // Reset form
      setNewReview({ rating: 0, feedback: '', skillTaught: '' });
      
      // Update match with new review
      const updatedMatches = matches.map(match => 
        match._id === matchId 
          ? { ...match, rating: response.rating }
          : match
      );
      setMatches(updatedMatches);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-container">
        <div className="reviews-list">
          <div className="reviews-header">
            <h2>Skill Match Reviews</h2>
          </div>
          <div className="reviews-filters">
            <div className="search-box">
              <i className="bx bx-search"></i>
              <input type="text" placeholder="Search matches..." />
            </div>
          </div>
          <div className="review-cards">
            {matches.map(match => (
              <div 
                key={match._id} 
                className={`review-card ${selectedMatch?._id === match._id ? 'active' : ''}`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="review-card-content">
                  <div className="review-header">
                    <h3>{match.skillToTeach}</h3>
                    {match.rating && <span className="rating">★ {match.rating}</span>}
                  </div>
                  <p className="teacher">Teacher: {match.teacherId.name}</p>
                  <p className="learner">Learner: {match.learnerId.name}</p>
                  <div className="match-meta">
                    <div className="status">
                      <i className="bx bx-check-circle"></i>
                      <span>{match.status}</span>
                    </div>
                    <div className="location">
                      <i className="bx bx-map"></i>
                      <span>{match.preferredLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMatch && (
          <div className="review-details">
            <div className="details-header">
              <div className="header-content">
                <button className="back-btn" onClick={() => setSelectedMatch(null)}>
                  <i className="bx bx-arrow-back"></i>
                </button>
                <div>
                  <h2>{selectedMatch.skillToTeach}</h2>
                  <p className="participants">
                    {selectedMatch.teacherId.name} teaching {selectedMatch.learnerId.name}
                  </p>
                </div>
                {selectedMatch.rating && <span className="rating">★ {selectedMatch.rating}</span>}
              </div>
              <div className="tab-navigation">
                <button 
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <i className="bx bx-info-circle"></i>
                  Details
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <i className="bx bx-comment"></i>
                  Reviews
                </button>
              </div>
            </div>

            <div className="details-content">
              {activeTab === 'details' && (
                <div className="match-details">
                  {selectedMatch.status === 'completed' && !selectedMatch.rating && (
                    <div className="detail-section">
                      <h3>Write a Review</h3>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map(value => (
                          <button
                            key={value}
                            className={`star-btn ${value <= newReview.rating ? 'active' : ''}`}
                            onClick={() => setNewReview({ ...newReview, rating: value })}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newReview.feedback}
                        onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}
                        placeholder="Write your feedback..."
                      />
                      <button 
                        className="submit-review-btn"
                        onClick={() => handleSubmitReview(selectedMatch._id)}
                        disabled={!newReview.rating || !newReview.feedback}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                  <div className="detail-section">
                    <h3>Match Details</h3>
                    <div className="match-stats">
                      <div className="stat-item">
                        <span className="stat-label">Status</span>
                        <span className="stat-value">{selectedMatch.status}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Location</span>
                        <span className="stat-value">{selectedMatch.preferredLocation}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Created</span>
                        <span className="stat-value">
                          {new Date(selectedMatch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  {reviews
                    .filter(review => review.matchId === selectedMatch._id)
                    .map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <span className="rating">{'★'.repeat(review.rating)}</span>
                          <span className="date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="feedback">{review.feedback}</p>
                        <p className="reviewer">
                          - {review.reviewerId.name}
                        </p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage; 