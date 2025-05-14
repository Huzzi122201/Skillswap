import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import './Hero.css';

const Hero = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();

  return (
    <div className="hero-wrapper">
      <section className="hero">
        <div className="hero-content">
          <h1>
            <span>Share Skills,</span>
            <span>Learn Together</span>
          </h1>
          <p>Join a community where everyone is both a teacher and a learner. Share your expertise, learn new skills, and grow together with passionate creators worldwide.</p>
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => openModal('signup')}
            >
              Start Teaching & Learning
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/courses')}
            >
              Browse Skills
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;