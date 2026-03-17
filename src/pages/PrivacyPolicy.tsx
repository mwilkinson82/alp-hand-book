import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="handbook-title text-3xl md:text-4xl mb-8">Privacy Policy</h1>

        <div className="body-text space-y-6 opacity-80">
          <p>
            This privacy policy explains how The ALP Handbook ("we," "us") collects, uses,
            and protects your information when you use our website and digital handbook.
          </p>

          <h2 className="section-heading text-xl mt-10 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account information:</strong> Email address used for authentication and access to the handbook.</li>
            <li><strong>Payment information:</strong> Payment processing is handled securely by Stripe. We do not store your credit card details.</li>
            <li><strong>Usage data:</strong> Basic analytics about how you interact with the handbook to improve the experience.</li>
          </ul>

          <h2 className="section-heading text-xl mt-10 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain access to the handbook</li>
            <li>To process your purchase via Stripe</li>
            <li>To send you access credentials and important updates about your purchase</li>
          </ul>

          <h2 className="section-heading text-xl mt-10 mb-4">Third-Party Services</h2>
          <p>
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Stripe</strong> — for secure payment processing</li>
            <li><strong>Authentication services</strong> — for secure account management</li>
          </ul>

          <h2 className="section-heading text-xl mt-10 mb-4">Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information. All data transmission
            is encrypted, and payment processing is handled by PCI-compliant services.
          </p>

          <h2 className="section-heading text-xl mt-10 mb-4">Your Rights</h2>
          <p>
            You may request deletion of your account and associated data at any time by contacting us.
          </p>

          <h2 className="section-heading text-xl mt-10 mb-4">Contact</h2>
          <p>
            For privacy-related questions, please reach out via the contact information on our website.
          </p>

          <p className="text-sm opacity-50 mt-12">Last updated: March 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
