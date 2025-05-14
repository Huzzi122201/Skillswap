import React, { useState } from 'react';
import { categoryImages, courseImages, defaultImages } from '../constants/imageUrls';

const categories = [
  'Popular Now', 'Digital Creation', 'Creative Writing', 'Business Skills',
  'Tech & Coding', 'Lifestyle', 'Visual Arts', 'Music & Audio',
  'Design', 'Animation', 'Crafts', 'Personal Growth'
];

const courseData = [
  {
    id: 1,
    image: courseImages.webDevelopment,
    badge: 'Featured Creator',
    title: 'Build Modern Websites: A Developer\'s Guide to Clean Code',
    category: 'Tech & Coding'
  },
  {
    id: 2,
    image: courseImages.musicProduction,
    badge: 'Community Favorite',
    title: 'Music Production Basics: From Your Room to SoundCloud',
    category: 'Music & Audio'
  },
  {
    id: 3,
    image: courseImages.digitalArt,
    badge: 'Rising Star',
    title: 'Digital Art Fundamentals: Find Your Style',
    category: 'Visual Arts'
  },
  {
    id: 4,
    image: courseImages.photography,
    badge: 'Top Rated',
    title: 'Photography Masterclass: From Beginner to Pro',
    category: 'Visual Arts'
  }
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('Popular Now');
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (courseId) => {
    setImageErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  const getCategoryImage = (category) => {
    const mappedCategory = category.replace(/\s+/g, '');
    return categoryImages[mappedCategory] || defaultImages.course;
  };

  return (
    <section className="courses-section">
      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {courseData.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img
                src={imageErrors[course.id] ? defaultImages.course : course.image}
                alt={course.title}
                onError={() => handleImageError(course.id)}
              />
              {course.badge && <span className="badge">{course.badge}</span>}
            </div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="category">{course.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses; 