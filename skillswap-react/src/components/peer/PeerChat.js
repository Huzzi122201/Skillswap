import React, { useState } from 'react';
import ChatSystem from '../chat/ChatSystem';
import './PeerChat.css';

const PeerChat = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState('chat');

  // Mock data for peer reviews
  const peerReviews = [
    {
      id: 1,
      project: "React Portfolio Website",
      author: "Mike Wilson",
      status: "Pending Review",
      submittedDate: "2024-03-15",
      reviewers: 0,
      targetReviewers: 3,
      description: "A modern portfolio website built with React and Tailwind CSS. Looking for feedback on code organization and performance optimization.",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      timeEstimate: "30-45 minutes"
    },
    {
      id: 2,
      project: "E-commerce UI Design",
      author: "Emily Chen",
      status: "In Review",
      submittedDate: "2024-03-14",
      reviewers: 2,
      targetReviewers: 3,
      description: "UI design for an e-commerce platform focusing on user experience and accessibility. Need feedback on color scheme and navigation flow.",
      skills: ["UI Design", "Figma", "Accessibility"],
      timeEstimate: "20-30 minutes"
    }
  ];

  const renderSidebarContent = () => {
    if (activeSidebarTab === 'chat') {
      return <ChatSystem mode="direct" />;
    } else {
      return (
        <div className="sidebar-reviews">
          <h3>Pending Reviews</h3>
          <div className="sidebar-review-list">
            {peerReviews.map(review => (
              <div key={review.id} className="sidebar-review-item">
                <h4>{review.project}</h4>
                <p className="author">by {review.author}</p>
                <div className="review-meta">
                  <span className={`status ${review.status.toLowerCase().replace(' ', '-')}`}>
                    {review.status}
                  </span>
                  <span>{review.reviewers}/{review.targetReviewers} Reviewers</span>
                </div>
                <button className="review-btn-small">
                  {review.status === 'Pending Review' ? 'Review' : 'View'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="peer-chat">
      <div className="peer-sidebar">
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${activeSidebarTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveSidebarTab('chat')}
          >
            Direct Chat
          </button>
          <button 
            className={`sidebar-tab ${activeSidebarTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveSidebarTab('reviews')}
          >
            Reviews
          </button>
        </div>
        <div className="sidebar-content">
          {renderSidebarContent()}
        </div>
      </div>
    </div>
  );
};

export default PeerChat; 