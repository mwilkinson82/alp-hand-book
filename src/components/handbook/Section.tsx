import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="mt-16 md:mt-24 mb-20">
      {title && <h3 className="section-heading">{title}</h3>}
      <div className="body-text">
        {children}
      </div>
    </section>
  );
};

export default Section;
