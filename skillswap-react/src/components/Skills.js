import React from 'react';

const skillsData = [
  { icon: 'fas fa-code', title: 'Code Magic' },
  { icon: 'fas fa-paint-brush', title: 'Design' },
  { icon: 'fas fa-camera', title: 'Photography' },
  { icon: 'fas fa-cube', title: '3D Design' },
  { icon: 'fas fa-chart-line', title: 'Marketing' }
];

const Skills = () => {
  return (
    <section className="skills-section">
      <div className="skills-container">
        <div className="skills-row">
          {/* Original set */}
          {skillsData.map((skill, index) => (
            <div className="skill-card" key={index}>
              <i className={skill.icon}></i>
              <div className="skill-title">{skill.title}</div>
            </div>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {skillsData.map((skill, index) => (
            <div className="skill-card" key={`duplicate-${index}`}>
              <i className={skill.icon}></i>
              <div className="skill-title">{skill.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills; 