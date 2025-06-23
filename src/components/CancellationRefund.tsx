import React from 'react';
import { ShieldCheck, RefreshCcw, XCircle } from 'lucide-react';

const CancellationRefund: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Cancellation & Refund Policy</h1>
      <p className="text-sm text-gray-500 text-center mb-6">Last updated on 30-03-2025 01:11:42</p>

      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <p className="text-gray-700 leading-relaxed">
          <span className="font-semibold">AMIT SANJAYSINGH PARDESHI</span> believes in helping its customers as much as possible and follows a liberal cancellation policy:
        </p>

        <div className="mt-6 space-y-6">
          {/* Cancellation Policy */}
          <div className="flex items-start space-x-4">
            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Order Cancellation</h2>
              <p className="text-gray-600">
                Cancellations are only allowed immediately after placing an order. If the order has already been processed or shipped, cancellation requests cannot be entertained.
              </p>
            </div>
          </div>

          {/* Refund for Damaged Items */}
          <div className="flex items-start space-x-4">
            <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Damaged or Defective Items</h2>
              <p className="text-gray-600">
                If you receive a damaged or defective item, report it within <span className="font-semibold">7 days</span> to our Customer Service team for review.
              </p>
            </div>
          </div>

          {/* Refund Processing */}
          <div className="flex items-start space-x-4">
            <RefreshCcw className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Refund Processing</h2>
              <p className="text-gray-600">
                Approved refunds will be processed within <span className="font-semibold">3-5 business days</span>. If your product has a manufacturer’s warranty, please contact them directly.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-700">For any further assistance, please contact our support team at:</p>
          <p className="text-blue-600 font-semibold mt-2">support@easyhope.com</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;
