import React from 'react';

interface TocItem {
  id: string;
  title: string;
  chapter?: string;
}

interface TocSection {
  part?: string;
  title: string;
  items: TocItem[];
}

const tocData: TocSection[] = [
  {
    title: 'Front Matter',
    items: [
      { id: 'dedication', title: 'Dedication' },
      { id: 'foreword', title: 'Foreword / Author\'s Note' },
      { id: 'how-to-use', title: 'How to Use This Handbook' },
    ],
  },
  {
    part: 'I',
    title: 'The Frame',
    items: [
      { id: 'chapter-1', chapter: '1', title: 'The ALP Doctrine (Altitude, Logic, Pressure)' },
      { id: 'chapter-2', chapter: '2', title: 'All Problems Are Entrepreneurial Problems' },
      { id: 'chapter-3', chapter: '3', title: 'The ALP Scaling Stool' },
    ],
  },
  {
    part: 'II',
    title: 'The Stool (Systems)',
    items: [
      { id: 'chapter-4', chapter: '4', title: 'Marketing as Infrastructure' },
      { id: 'chapter-5', chapter: '5', title: 'Upstream Marketing & Being "In the Know"' },
      { id: 'chapter-6', chapter: '6', title: 'Sales, Pressure, and Clarity' },
      { id: 'chapter-7', chapter: '7', title: 'Operations as Margin Protection' },
      { id: 'chapter-8', chapter: '8', title: 'General Conditions & Invisible Costs' },
      { id: 'chapter-9', chapter: '9', title: 'The ALP Decision Matrix' },
      { id: 'chapter-10', chapter: '10', title: 'From Chaos to Control' },
    ],
  },
  {
    part: 'III',
    title: 'Time, Money, & Leverage',
    items: [
      { id: 'chapter-11', chapter: '11', title: 'Documentation as Leverage' },
      { id: 'chapter-12', chapter: '12', title: 'Notices & Playing Offense' },
      { id: 'chapter-13', chapter: '13', title: 'Scheduling as Time Control' },
      { id: 'chapter-14', chapter: '14', title: 'Start–Stop Work and Productivity Loss' },
      { id: 'chapter-15', chapter: '15', title: 'Financial Command: Seeing the Business Clearly' },
      { id: 'chapter-16', chapter: '16', title: 'CPM Schedules, Start–Stop Work, and the Cost of Disorder' },
      { id: 'chapter-17', chapter: '17', title: 'Documentation, Entitlement, and Proof' },
    ],
  },
  {
    part: 'IV',
    title: 'Identity & Scale',
    items: [
      { id: 'chapter-18', chapter: '18', title: 'Scaling Without Losing Control' },
      { id: 'chapter-19', chapter: '19', title: 'Leadership, Standards, and Cultural Enforcement' },
      { id: 'chapter-20', chapter: '20', title: 'Identity, Self-Opinion, and Pressure' },
      { id: 'chapter-21', chapter: '21', title: 'Using the ALP Handbook in Real Time' },
    ],
  },
  {
    part: 'V',
    title: 'Commitment',
    items: [
      { id: 'chapter-22', chapter: '22', title: 'The ALP Way (Doctrine & Commitment)' },
    ],
  },
];

interface TableOfContentsProps {
  onNavigate?: (id: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ onNavigate }) => {
  const handleClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="py-16">
      <h2 className="chapter-heading mb-12">Table of Contents</h2>
      {tocData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          {section.part ? (
            <div className="toc-part">Part {section.part} — {section.title}</div>
          ) : (
            <div className="toc-part">{section.title}</div>
          )}
          {section.items.map((item) => (
            <div
              key={item.id}
              className="toc-item flex items-baseline gap-4 px-4"
              onClick={() => handleClick(item.id)}
            >
              {item.chapter && (
                <span className="text-sm opacity-50 font-sans w-8">{item.chapter}</span>
              )}
              <span className="body-text flex-1">{item.title}</span>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default TableOfContents;
