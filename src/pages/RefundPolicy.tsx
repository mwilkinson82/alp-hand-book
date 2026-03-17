import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="handbook-title text-3xl md:text-4xl mb-8">Refund Policy</h1>

        <div className="body-text space-y-6 opacity-80">
          <p>
            The ALP Handbook is a digital product delivered as an interactive web-based reading experience.
            Because access is granted immediately upon purchase, <strong>all sales are final</strong>.
          </p>

          <p>
            We do not offer refunds for digital products once access has been delivered.
          </p>

          <h2 className="section-heading text-xl mt-10 mb-4">Why No Refunds?</h2>
          <p>
            Unlike physical goods, digital content cannot be "returned." Once you have access to the
            full handbook, the product has been fully delivered. We encourage you to explore the
            free preview experience before purchasing to ensure it meets your expectations.
          </p>

          <h2 className="section-heading text-xl mt-10 mb-4">Questions?</h2>
          <p>
            If you experience any technical issues accessing the handbook after purchase,
            please contact us and we will resolve the issue promptly.
          </p>

          <p className="text-sm opacity-50 mt-12">Last updated: March 2025</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
