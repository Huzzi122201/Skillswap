import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import 'boxicons/css/boxicons.min.css';
import '../styles/variables.css';
import '../styles/buttons.css';
import '../styles/navigation.css';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <main>
        <Hero />

        <section className="learning-features">
          <div className="learning-header">
            <h2>Learn, Share, Grow Together</h2>
            <p className="learning-subtitle">Connect with peers, share knowledge, and master new skills in a supportive community</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-capsule">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div className="feature-content">
                <h3>Peer Learning Network</h3>
                <p>Connect with skilled individuals across various domains. Share your expertise, learn from others, and grow together in a collaborative environment focused on mutual growth.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-capsule">
                  <i className="fas fa-comments"></i>
                </div>
              </div>
              <div className="feature-content">
                <h3>Interactive Feedback</h3>
                <p>Give and receive constructive feedback, engage in meaningful discussions, and improve your skills through real conversations with peers who share your passion for learning.</p>
              </div>
            </div>

            <div className="feature-card large-card">
              <div className="feature-icon">
                <div className="icon-capsule">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              </div>
              <div className="feature-content">
                <h3>Community-Driven Learning</h3>
                <p>Experience a unique learning environment where everyone is both a teacher and a student. Share your projects, get expert reviews, mentor others, and build your portfolio while being part of a supportive community that celebrates growth and collaboration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <div className="skills-container">
            <div className="skills-row">
              {[...Array(2)].map((_, index) => (
                <React.Fragment key={index}>
                  <div className="skill-card">
                    <i className='fas fa-code'></i>
                    <div className="skill-title">Code Magic</div>
                  </div>
                  <div className="skill-card">
                    <i className='fas fa-paint-brush'></i>
                    <div className="skill-title">Design</div>
                  </div>
                  <div className="skill-card">
                    <i className='fas fa-camera'></i>
                    <div className="skill-title">Photography</div>
                  </div>
                  <div className="skill-card">
                    <i className='fas fa-cube'></i>
                    <div className="skill-title">3D Design</div>
                  </div>
                  <div className="skill-card">
                    <i className='fas fa-chart-line'></i>
                    <div className="skill-title">Marketing</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>Discover</h2>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/careers">Join Our Team</Link></li>
              <li><Link to="/news">Latest News</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
              <li><Link to="/partner">Partner Program</Link></li>
              <li><Link to="/creative-hub">Creative Hub</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h2>Connect</h2>
            <ul className="footer-links">
              <li><Link to="/group-learning">Group Learning</Link></li>
              <li><Link to="/gift">Gift SkillSwap</Link></li>
              <li><Link to="/enterprise">Enterprise Solutions</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h2>Teach</h2>
            <ul className="footer-links">
              <li><Link to="/teach">Share Your Expertise</Link></li>
              <li><Link to="/instructor-guide">Instructor Guide</Link></li>
              <li><Link to="/guidelines">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2025 SkillSwap. Empowering Creativity Worldwide</span>
            <Link to="/support">Support</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/cookies">Cookie Settings</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
          <div className="footer-bottom-right">
            <div className="social-links">
              <a href="https://instagram.com/skillswap" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com/skillswap" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://github.com/skillswap" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/company/skillswap" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com/skillswap" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <div className="language-selector">
              <i className="fas fa-globe"></i>
              <span>English</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 