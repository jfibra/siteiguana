"use client"

import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16 gradient-bg flex flex-col items-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full mx-4 bg-white p-8 rounded-xl shadow-xl"
      >
        <h1 className="font-plus-jakarta font-extrabold text-4xl md:text-5xl mb-6 text-center">
          Terms of <span className="gradient-text">Service</span>
        </h1>
        <div className="prose max-w-none text-gray-700">
          <p>
            Welcome to WebFlow Pro! These Terms of Service ("Terms") govern your access to and use of our website design
            and management services. By accessing or using our services, you agree to be bound by these Terms.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our services, you confirm that you have read, understood, and agree to be bound by these Terms,
            including any future modifications. If you do not agree to these Terms, you may not use our services.
          </p>
          <h2>2. Services Provided</h2>
          <p>
            WebFlow Pro provides website design, development, hosting, maintenance, and content update services on a
            subscription basis. The specific features and limitations of each plan are detailed on our Services page.
          </p>
          <h2>3. Subscription and Payments</h2>
          <ul>
            <li>
              <strong>Billing:</strong> Services are billed on a monthly basis. By subscribing, you authorize us to
              charge your chosen payment method.
            </li>
            <li>
              <strong>Setup Fees:</strong> A one-time setup fee may apply to certain plans, as specified on our pricing
              page.
            </li>
            <li>
              <strong>Cancellations:</strong> You may cancel your subscription at any time. Your service will remain
              active until the end of your current billing cycle. No refunds will be issued for partial months.
            </li>
          </ul>
          <h2>4. Your Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on or through our services. You grant
            WebFlow Pro a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and
            distribute such content for the purpose of providing and promoting the services.
          </p>
          <h2>5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the services for any illegal or unauthorized purpose.</li>
            <li>Interfere with or disrupt the integrity or performance of the services.</li>
            <li>Upload or transmit any malicious code, viruses, or harmful data.</li>
          </ul>
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            Our services are provided "as is" and "as available" without any warranties of any kind, either express or
            implied, including, but not limited to, implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall WebFlow Pro be liable for any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data,
            use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to
            access or use the services; (b) any conduct or content of any third party on the services; or (c)
            unauthorized access, use, or alteration of your transmissions or content.
          </p>
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new
            Terms on this page. Your continued use of the services after such modifications will constitute your
            acknowledgment of the modified Terms and agreement to abide and be bound by the modified Terms.
          </p>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
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
