import React, { useState } from 'react';
import ChatSystem from '../components/chat/ChatSystem';
import { useAuth } from '../context/AuthContext';
import '../styles/CommunityPage.css';

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const [selectedForum, setSelectedForum] = useState(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forums, setForums] = useState([
    {
      id: 1,
      title: "Web Development",
      description: "Discuss web development technologies and best practices",
      topics: 156,
      posts: 1234,
      lastActive: "2 hours ago",
      participants: 234
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "Share design tips, tools, and get feedback",
      topics: 98,
      posts: 876,
      lastActive: "1 hour ago",
      participants: 156
    },
    {
      id: 3,
      title: "Data Science",
      description: "Explore data analysis, ML, and AI discussions",
      topics: 134,
      posts: 987,
      lastActive: "30 minutes ago",
      participants: 189
    }
  ]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !newTopic.tags.includes(tagInput.trim())) {
      setNewTopic(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewTopic(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/community/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          ...newTopic,
          forumId: selectedForum?.id || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      const data = await response.json();
      
      // Update the forums list with the new topic
      const updatedForums = forums.map(forum => {
        if (forum.id === data.forumId) {
          return {
            ...forum,
            topics: forum.topics + 1,
            lastActive: 'Just now'
          };
        }
        return forum;
      });

      setForums(updatedForums);
      setShowNewTopicModal(false);
      setNewTopic({
        title: '',
        content: '',
        category: 'discussion',
        tags: []
      });
      setError(null);
      
      // Show success message or redirect to the new topic
      // You can add a toast notification here
    } catch (error) {
      console.error('Error creating topic:', error);
      setError('Failed to create topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community-page">
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      ) : (
        <div className="community-main">
          <header className="page-header">
            <h1>Community Forums</h1>
            <p>Connect, learn, and grow with fellow learners</p>
          </header>

          <div className="forums-section">
            <div className="section-header">
              <h2>Discussion Forums</h2>
              <button 
                className="create-btn"
                onClick={() => setShowNewTopicModal(true)}
              >
                Create New Topic
              </button>
            </div>
            <div className="forums-grid">
              {forums.map(forum => (
                <div 
                  key={forum.id} 
                  className="forum-card"
                  onClick={() => setSelectedForum(forum)}
                >
                  <h3>{forum.title}</h3>
                  <p>{forum.description}</p>
                  <div className="forum-stats">
                    <span>{forum.topics} Topics</span>
                    <span>{forum.posts} Posts</span>
                    <span>Last active {forum.lastActive}</span>
                  </div>
                  <div className="forum-participants">
                    <i className="bx bx-user"></i>
                    <span>{forum.participants} participants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Topic Modal */}
          {showNewTopicModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Create New Topic</h2>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowNewTopicModal(false);
                      setError(null); // Clear any errors when closing
                    }}
                  >
                    ×
                  </button>
                </div>
                {error && (
                  <div className="modal-error">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmitTopic}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic(prev => ({
                        ...prev,
                        title: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={newTopic.category}
                      onChange={(e) => setNewTopic(prev => ({
                        ...prev,
                        category: e.target.value
                      }))}
                    >
                      <option value="discussion">Discussion</option>
                      <option value="question">Question</option>
                      <option value="showcase">Showcase</option>
                      <option value="resource">Resource</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      value={newTopic.content}
                      onChange={(e) => setNewTopic(prev => ({
                        ...prev,
                        content: e.target.value
                      }))}
                      required
                      rows="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-input">
                      <div className="tags-list">
                        {newTopic.tags.map(tag => (
                          <span key={tag} className="tag">
                            {tag}
                            <button 
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-group">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add a tag"
                        />
                        <button 
                          type="button"
                          onClick={handleAddTag}
                          className="add-tag-btn"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowNewTopicModal(false);
                        setError(null); // Clear any errors when canceling
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Topic'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 