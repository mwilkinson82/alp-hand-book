import React from 'react';
import ChapterHeader from '../ChapterHeader';
import Section from '../Section';
import DoctrineList from '../DoctrineList';
import Parable from '../Parable';

const Chapter3: React.FC = () => {
  return (
    <div id="chapter-3" className="py-24 border-t border-chapter-divider">
      <ChapterHeader 
        number={3} 
        title="The ALP Scaling Stool" 
      />

      <div className="body-text space-y-6 max-w-3xl">
        <p>
          Businesses do not grow like ladders.
        </p>
        <p>
          They grow like stools.
        </p>
        <p>
          Five legs:
        </p>
        <DoctrineList items={[
          "Marketing",
          "Sales",
          "Operations",
          "People",
          "Financial Command"
        ]} />
        <p>
          If any leg is weak, the stool wobbles.
        </p>
        <p className="body-text-emphasis">
          If two are weak, it collapses.
        </p>
      </div>

      <div className="chapter-divider" />

      <Section title="Why the Stool Matters">
        <p>
          Most businesses fail asymmetrically.
        </p>
        <p>
          One leg grows faster than the others.
        </p>
        <p>
          Marketing outruns operations.<br />
          Sales outruns people.<br />
          Revenue outruns financial clarity.
        </p>
        <p className="body-text-emphasis">
          Instability follows.
        </p>
      </Section>

      <Section title="The Two Dominant Legs">
        <p>
          All legs matter.
        </p>
        <p>
          But two feed the rest:
        </p>
        <DoctrineList items={[
          "Marketing",
          "Sales"
        ]} />
        <p>
          If these fail, nothing downstream survives.
        </p>
        <p>
          This is not opinion.<br />
          It is structural truth.
        </p>
      </Section>

      <Section title="Balance Over Brilliance">
        <p>
          You do not need perfection.
        </p>
        <p>
          You need balance.
        </p>
        <p className="body-text-emphasis">
          A boring, consistent stool beats a brilliant, unstable one every time.
        </p>
      </Section>

      <Parable title="The Uneven Table">
        <p>
          A table with one short leg rocks constantly.
        </p>
        <p>
          Adding weight doesn't fix it.<br />
          Decorating it doesn't fix it.
        </p>
        <p className="body-text-emphasis">
          Only balance does.
        </p>
      </Parable>

      <Section title="The Entrepreneur's Role">
        <p>
          Your job is not to work in the stool.
        </p>
        <p>
          Your job is to:
        </p>
        <DoctrineList items={[
          "Inspect it",
          "Reinforce it",
          "Balance it",
          "Protect it"
        ]} />
        <p className="body-text-emphasis">
          That is command.
        </p>
      </Section>
    </div>
  );
};

export default Chapter3;
