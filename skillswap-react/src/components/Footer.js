import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Discover</h2>
          <ul className="footer-links">
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Join Our Team</a></li>
            <li><a href="#">Latest News</a></li>
            <li><a href="#">Success Stories</a></li>
            <li><a href="#">Partner Program</a></li>
            <li><a href="#">Creative Hub</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Connect</h2>
          <ul className="footer-links">
            <li><a href="#">Group Learning</a></li>
            <li><a href="#">Gift SkillSwap</a></li>
            <li><a href="#">Enterprise Solutions</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Teach</h2>
          <ul className="footer-links">
            <li><a href="#">Share Your Expertise</a></li>
            <li><a href="#">Instructor Guide</a></li>
            <li><a href="#">Community Guidelines</a></li>
          </ul>
        </div>
        <div className="footer-section">
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span>© 2025 SkillSwap. Empowering Creativity Worldwide</span>
          <a href="#">Support</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Settings</a>
          <a href="#">Accessibility</a>
        </div>
        <div className="footer-bottom-right">
          <div className="social-links">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          </div>
          <div className="language-selector">
            <i className="fas fa-globe"></i>
            <span>English</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 