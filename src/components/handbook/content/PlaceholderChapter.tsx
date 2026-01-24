import React from 'react';
import ChapterHeader from '../ChapterHeader';
import Section from '../Section';
import DoctrineList from '../DoctrineList';
import MediaPlaceholder from '../MediaPlaceholder';

interface PlaceholderChapterProps {
  id: string;
  number: number;
  title: string;
}

const PlaceholderChapter: React.FC<PlaceholderChapterProps> = ({ id, number, title }) => {
  return (
    <div id={id} className="py-24 border-t border-chapter-divider">
      <ChapterHeader number={number} title={title} />
      
      <div className="body-text space-y-6 max-w-3xl">
        <p className="opacity-60 italic">
          This chapter content is forthcoming and will be added to the complete manuscript.
        </p>
      </div>
      
      <MediaPlaceholder type="audio" />
      <MediaPlaceholder type="video" />
    </div>
  );
};

export default PlaceholderChapter;
