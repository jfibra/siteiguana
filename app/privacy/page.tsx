"use client"

import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-16 gradient-bg flex flex-col items-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full mx-4 bg-white p-8 rounded-xl shadow-xl"
      >
        <h1 className="font-plus-jakarta font-extrabold text-4xl md:text-5xl mb-6 text-center">
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <div className="prose max-w-none text-gray-700">
          <p>
            At WebFlow Pro, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <h2>1. Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account or subscribe to our services.</li>
            <li>Fill out forms on our website (e.g., contact forms, questionnaires).</li>
            <li>Communicate with us via email, phone, or live chat.</li>
            <li>Upload content or assets for your website.</li>
          </ul>
          <p>This information may include your name, email address, phone number, company name, and payment details.</p>
          <p>
            We also collect non-personal information automatically when you access our services, such as your IP
            address, browser type, operating system, referring URLs, and website usage data.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our services.</li>
            <li>Process your transactions and manage your subscriptions.</li>
            <li>Communicate with you about your account, services, and updates.</li>
            <li>Personalize your experience and deliver tailored content.</li>
            <li>Improve our website, services, and customer support.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Detect, prevent, and address technical issues or fraudulent activities.</li>
            <li>Comply with legal obligations.</li>
          </ul>
          <h2>3. Disclosure of Your Information</h2>
          <p>We may share your information with third parties in the following situations:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party vendors, consultants,
              and other service providers who perform services on our behalf (e.g., payment processing, hosting,
              analytics).
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
              response to valid requests by public authorities (e.g., a court order or government agency).
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of
              company assets, financing, or acquisition of all or a portion of our business to another company.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with
              your consent.
            </li>
          </ul>
          <h2>4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access,
            use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
          <h2>5. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right to rectify any inaccurate information.</li>
            <li>The right to object to our processing of your personal data.</li>
            <li>The right to request the restriction of the processing of your personal data.</li>
            <li>The right to data portability.</li>
            <li>
              The right to withdraw consent at any time where WebFlow Pro relied on your consent to process your
              personal information.
            </li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details below.</p>
          <h2>6. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our service and hold certain
            information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions of our service.
          </p>
          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hello@webflowpro.com" className="text-blue-600 hover:underline">
              hello@webflowpro.com
            </a>
            .
          </p>
          <p className="text-sm text-gray-500 mt-8">Last updated: June 16, 2025</p>
        </div>
      </motion.div>
    </div>
  )
}
