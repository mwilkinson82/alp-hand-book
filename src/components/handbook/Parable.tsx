import React from 'react';

interface ParableProps {
  title: string;
  children: React.ReactNode;
}

const Parable: React.FC<ParableProps> = ({ title, children }) => {
  return (
    <div className="parable-container">
      <div className="parable-label">Parable</div>
      <h4 className="subsection-heading italic">{title}</h4>
      <div className="body-text space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Parable;
