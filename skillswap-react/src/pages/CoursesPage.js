import React, { useState, useEffect, useMemo } from 'react';
import { courseAPI } from '../services/courseAPI';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/CoursesPage.css';

const CoursesPage = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const categoryImages = useMemo(() => ({
    Programming: '/images/courses/programming.jpg',
    Design: '/images/courses/design.jpg',
    Business: '/images/courses/business.jpg',
    Marketing: '/images/courses/marketing.jpg',
    Language: '/images/courses/language.jpg',
    Music: '/images/courses/music.jpg',
    Art: '/images/courses/art.jpg',
    Other: '/images/courses/other.jpg',
  }), []);

  const defaultImage = '/images/courses/default-course.jpg';

  const handleImageError = (courseId) => {
    setImageErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await courseAPI.getAllCourses();
        // Filter out courses the user is already enrolled in
        const availableCourses = fetchedCourses.filter(course => 
          !course.enrolledStudents?.includes(currentUser.id)
        );
        const coursesWithImages = availableCourses.map(course => ({
          ...course,
          image: course.image || categoryImages[course.category] || defaultImage,
        }));
        setCourses(coursesWithImages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryImages, currentUser]);

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'Programming', name: 'Programming' },
    { id: 'Design', name: 'Design' },
    { id: 'Business', name: 'Business' },
    { id: 'Marketing', name: 'Marketing' },
    { id: 'Language', name: 'Language' },
    { id: 'Music', name: 'Music' },
    { id: 'Art', name: 'Art' },
    { id: 'Other', name: 'Other' }
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  const handleEnrollment = async (courseId) => {
    try {
      // Here you would implement the enrollment/purchase flow
      // This could include:
      // 1. Opening a payment modal
      // 2. Processing the payment
      // 3. Enrolling the user in the course
      console.log('Starting enrollment process for course:', courseId);
    } catch (error) {
      console.error('Error during enrollment:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading available courses...</p>
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
    <ProtectedRoute>
      <div className="courses-page">
        <header className="page-header">
          <h1>Premium Courses</h1>
          <p>Invest in your skills with our professional courses</p>
        </header>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course._id || course.id} className="course-card">
              <div className="course-image">
                <img 
                  src={imageErrors[course._id || course.id] ? defaultImage : course.image} 
                  alt={course.title}
                  onError={() => handleImageError(course._id || course.id)}
                />
                <span className="course-level">{course.level}</span>
                {course.featured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="instructor">by {course.instructor.name}</p>
                <div className="course-info">
                  <div className="course-stats">
                    <span className="rating">
                      ★ {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
                    </span>
                    <span className="students">
                      {course.totalStudents?.toLocaleString() || 0} enrolled
                    </span>
                  </div>
                  <div className="course-details">
                    <span className="duration">
                      <i className='bx bx-time'></i> {course.duration}
                    </span>
                    <span className="lessons">
                      <i className='bx bx-book-open'></i> {course.lessonsCount} lessons
                    </span>
                  </div>
                </div>
                <div className="course-footer">
                  <div className="price-container">
                    <span className="price">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="original-price">${course.originalPrice}</span>
                    )}
                  </div>
                  <button 
                    className="enroll-btn"
                    onClick={() => handleEnrollment(course._id || course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CoursesPage;