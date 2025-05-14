import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    coursesInProgress: 0,
    completedCourses: 0,
    hoursLearned: 0,
    achievementPoints: 0,
    enrolledCourses: [],
    achievements: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
    try {
      setLoading(true);
        
        // Only proceed if auth is done loading and we have a user
        if (!authLoading && !currentUser) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        // If still loading auth, don't fetch data yet
        if (authLoading) {
          return;
        }

        // Log authentication state
        console.log('Current user:', currentUser);
        console.log('Auth token:', localStorage.getItem('token'));
        
        const data = await dashboardService.getDashboardData();
        console.log('Dashboard data received:', data);
        
        setDashboardData(prevData => ({
          ...prevData,
          ...data
        }));
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 401) {
          console.log('Unauthorized access, redirecting to login');
          navigate('/login');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
    } finally {
      setLoading(false);
    }
    };

    fetchDashboardData();
  }, [currentUser, navigate, authLoading]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Only check currentUser after auth is done loading
  if (!authLoading && !currentUser) {
    return (
      <div className="error-container">
        <p>Please log in to view your dashboard</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
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

  return (
    <div className="dashboard">
    <div className="dashboard-page">
        <h1>Welcome, {currentUser.username || 'User'}!</h1>
        
      <div className="dashboard-stats">
        <div className="stat-box">
          <div className="stat-content">
              <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>Courses in Progress</h3>
                <p>{dashboardData.coursesInProgress || 0}</p>
              </div>
            </div>
          </div>
        <div className="stat-box">
          <div className="stat-content">
              <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Completed Courses</h3>
                <p>{dashboardData.completedCourses || 0}</p>
              </div>
            </div>
          </div>
        <div className="stat-box">
          <div className="stat-content">
              <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>Hours Learned</h3>
                <p>{dashboardData.hoursLearned || 0}</p>
              </div>
            </div>
          </div>
        <div className="stat-box">
          <div className="stat-content">
              <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Achievement Points</h3>
                <p>{dashboardData.achievementPoints || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="current-courses">
          <div className="section-header">
            <h2>My Enrolled Courses</h2>
      </div>
          {dashboardData.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
        <div className="courses-grid">
              {dashboardData.enrolledCourses.map((course, index) => (
                <div key={course.courseId || index} className="course-card">
              <div className="course-image">
                    <img src={course.thumbnail || course.image} alt={course.title} />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p className="instructor">
                      Instructor: {typeof course.instructor === 'object' ? course.instructor.name : course.instructor}
                    </p>
                    <div className="progress-bar">
                  <div 
                        className="progress"
                        style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
                    <p className="progress-text">{course.progress || 0}% Complete</p>
                    <button className="continue-btn">
                      Continue Learning
                      <i className="fas fa-arrow-right"></i>
                    </button>
              </div>
            </div>
          ))}
        </div>
          ) : (
            <p className="no-data-message">You haven't enrolled in any courses yet.</p>
          )}
      </section>

        <section className="achievements-section">
          <div className="section-header">
        <h2>Recent Achievements</h2>
          </div>
          {dashboardData.achievements && dashboardData.achievements.length > 0 ? (
        <div className="achievements-grid">
              {dashboardData.achievements.map((achievement, index) => (
                <div key={achievement.id || index} className="achievement-card">
                  <div className="achievement-icon">{achievement.icon || '🏆'}</div>
                  <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                  <div className="achievement-meta">
                    <span className="points">+{achievement.points || 0} points</span>
                    <span className="date">
                      {achievement.dateEarned ? new Date(achievement.dateEarned).toLocaleDateString() : 'N/A'}
                    </span>
              </div>
            </div>
          ))}
        </div>
          ) : (
            <p className="no-data-message">No achievements yet. Keep learning to earn some!</p>
          )}
        </section>

        <section className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
            <div className="activity-list">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'course_progress' ? '📚' :
                     activity.type === 'achievement' ? '🏆' :
                     activity.type === 'quiz_completion' ? '✅' : '📝'}
                  </div>
                  <div className="activity-info">
                    <p>{activity.description}</p>
                    <span className="activity-date">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No recent activity to show.</p>
          )}
      </section>
      </div>
    </div>
  );
};

export default Dashboard; 