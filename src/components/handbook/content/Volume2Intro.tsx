import React from 'react';
import Section from '../Section';

const Volume2Intro: React.FC = () => {
  return (
    <div id="volume-2-intro" className="py-24 border-t border-chapter-divider">
      <header className="mb-16 pt-8">
        <div className="text-sm uppercase tracking-widest opacity-50 mb-4 font-sans" style={{ letterSpacing: '0.2em' }}>
          Volume 2 — Foreword
        </div>
        <h2 className="chapter-heading">Why the Operating System</h2>
      </header>

      <div className="body-text space-y-6 max-w-3xl">
        <p>
          This volume belongs in the ALP Handbook as the field reference for why a contracting company needs a formal operating system.
        </p>
        <p>The goal is not to explain business theory.</p>
        <p>
          The goal is to show the owner, in plain language, why the company cannot keep running on memory, personality, hierarchy, and emergency response. The company needs a system. It needs rules. It needs roles. It needs numbers. It needs a weekly execution rhythm. It needs a place where all of that lives.
        </p>
        <p className="body-text-emphasis">That place is AOS.</p>
      </div>
    </div>
  );
};

export default Volume2Intro;
