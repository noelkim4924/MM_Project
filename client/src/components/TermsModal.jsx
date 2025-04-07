import React from "react";

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Shift the Odds – Mentor Match Terms of Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 본문 (스크롤 가능) */}
        <div className="p-6 overflow-y-auto flex-grow">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Effective Date:</strong> April 1, 2025
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Welcome to our Mentor Match platform operated by Shift the Odds, a Canadian nonprofit organization. This platform connects mentors and mentees across Canada to build skills, grow confidence, and create supportive networks in the tech sector. Before using the platform, please read these Terms carefully.
          </p>
          <p className="text-sm text-gray-600 mb-4 font-semibold">
            By signing up or using this platform, you agree to these Terms of Service. If you do not agree, please do not use the platform.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">1. Who Can Use This Platform</h3>
          <p className="text-sm text-gray-600 mt-2">To join the platform, you must:</p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Be at least 19 years old. This helps us maintain a safe and adult-centered community across all Canadian provinces.</li>
            <li>Understand that this platform is based in Canada and primarily designed for individuals residing in Canada. If you are outside Canada, you may still use the platform, but you agree to be bound by Canadian laws.</li>
            <li>Agree to these Terms and our Privacy Policy.</li>
            <li>We reserve the right to remove or suspend accounts that don’t meet these criteria.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">2. Your Role on the Platform</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Mentees can self-select mentors and manage their own growth journey.</li>
            <li>Mentors must apply and be approved before offering mentorship.</li>
            <li>Whether mentor or mentee, your role is to engage respectfully and safely in this shared space.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">3. Community Conduct</h3>
          <p className="text-sm text-gray-600 mt-2">We’re building a space that’s safe, inclusive, and empowering. That means you must not:</p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Harass, bully, threaten, or target others.</li>
            <li>Pretend to be someone else (no fake profiles).</li>
            <li>Share false or misleading info.</li>
            <li>Post inappropriate, offensive, or illegal content.</li>
            <li>Spam other users.</li>
            <li>Exploit the platform for commercial gain or solicitation.</li>
            <li>Use the platform in ways that harm others or our systems.</li>
            <li>Any violation of this code may result in a warning, suspension, or removal from the platform. We take this seriously.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">4. Mentorship Disclaimer</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Mentors on the platform are not licensed professionals. While many have strong backgrounds and lived experience in tech and related fields, the guidance provided is not a substitute for formal advice.</li>
            <li>Use your judgment. If you need legal, medical, financial, or psychological advice, please seek a licensed professional.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">5. Privacy and Data Use</h3>
          <p className="text-sm text-gray-600 mt-2">
            When you use the platform, we may collect personal info like your name (or chosen name), email, CVs or documents you upload, and your chat history.
          </p>
          <p className="text-sm text-gray-600 mt-2">We:</p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Store data securely while your account is active.</li>
            <li>Retain certain records for safety and accountability.</li>
            <li>Use chat logs and account data to monitor for safety concerns.</li>
            <li>Do not sell or share your information.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">6. Platform Changes and Availability</h3>
          <p className="text-sm text-gray-600 mt-2">
            We may update or change the platform at any time to improve your experience. We can’t guarantee perfect uptime, but we’ll do our best to keep things running smoothly.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">7. Account Termination</h3>
          <p className="text-sm text-gray-600 mt-2">
            We reserve the right to remove accounts that violate these Terms, or that pose a risk to community safety. You may also request to delete your account at any time.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">8. Interactions and Responsibility</h3>
          <p className="text-sm text-gray-600 mt-2">
            We’re committed to creating a safe and respectful space, but we can’t monitor every interaction. Please use your judgment and report anything that feels off. Shift the Odds isn’t responsible for the actions or content shared by other users.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">9. Jurisdiction and Applicable Law</h3>
          <p className="text-sm text-gray-600 mt-2">
            This platform is operated in British Columbia, Canada, and governed by the laws of the Province of British Columbia and the laws of Canada applicable therein. By using the platform, you agree that any dispute will be handled in accordance with these laws and you waive any rights under foreign jurisdiction.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">10. Need Help?</h3>
          <p className="text-sm text-gray-600 mt-2">
            Got a concern? Want to report misconduct or ask a question? Reach out to us directly at: <a href="mailto:mentor@shifttheodds.ca" className="text-blue-500 hover:underline">mentor@shifttheodds.ca</a>
          </p>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-300 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;