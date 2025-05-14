import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>About Us</h2>
          <ul className="footer-links">
            <li><a href="#about">Our Story</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Resources</h2>
          <ul className="footer-links">
            <li><a href="#blog">Blog</a></li>
            <li><a href="#guides">Guides</a></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Legal</h2>
          <ul className="footer-links">
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Download App</h2>
          <div className="app-store-buttons">
            <a href="#ios" className="store-button">
              <img src="/app-store.png" alt="Download on App Store" />
            </a>
            <a href="#android" className="store-button">
              <img src="/play-store.png" alt="Get it on Google Play" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>© 2024 SkillSwap. All rights reserved.</p>
          <a href="#sitemap">Sitemap</a>
          <a href="#accessibility">Accessibility</a>
        </div>
        <div className="footer-bottom-right">
          <div className="social-links">
            <a href="#twitter"><i className='bx bxl-twitter'></i></a>
            <a href="#facebook"><i className='bx bxl-facebook'></i></a>
            <a href="#instagram"><i className='bx bxl-instagram'></i></a>
            <a href="#linkedin"><i className='bx bxl-linkedin'></i></a>
          </div>
          <div className="language-selector">
            <i className='bx bx-globe'></i>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 