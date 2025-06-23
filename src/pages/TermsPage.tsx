import React from 'react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <p className="text-gray-600 mb-4">
            These Terms and Conditions, along with the Privacy Policy or other terms (“Terms”), constitute a binding agreement between 
            <strong> AMIT SANJAYSINGH PARDESHI</strong> (“Website Owner” or “we” or “us” or “our”) and you (“you” or “your”) and relate to your 
            use of our website, goods, or services (collectively, “Services”).
          </p>
          <p className="text-gray-600">
            By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). 
            We reserve the right to modify these Terms at any time without assigning any reason. It is your responsibility to periodically 
            review these Terms to stay informed of updates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Terms of Use</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">You agree to provide accurate and complete information during registration and use of the Services.</li>
            <li className="mb-2">We do not guarantee the accuracy, completeness, or reliability of the information on the website.</li>
            <li className="mb-2">Your use of the website and Services is at your own risk.</li>
            <li className="mb-2">Unauthorized use of the website may result in legal action.</li>
            <li className="mb-2">You agree to pay applicable charges for availing the Services.</li>
            <li className="mb-2">You must not use the website for any illegal activities.</li>
            <li className="mb-2">Third-party website links may be included, and their terms will apply upon access.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Terms</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">By initiating a transaction, you enter into a legally binding contract with us.</li>
            <li className="mb-2">Refunds will be provided if we are unable to deliver the Service within the specified timeline.</li>
            <li className="mb-2">Failure to claim a refund within the provided time frame will make you ineligible for it.</li>
            <li className="mb-2">We are not liable for failure to perform obligations due to force majeure events.</li>
            <li className="mb-2">These Terms are governed by the laws of India.</li>
            <li className="mb-2">Disputes shall be subject to the exclusive jurisdiction of courts in Malegaon Camp, Maharashtra.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-600">
            For any concerns or communications related to these Terms, please contact us using the details provided on this website.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
