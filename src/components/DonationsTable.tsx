import React from 'react';
import { Donation } from '../types';

interface DonationsTableProps {
  transactions: Donation[];
}

const DonationsTable: React.FC<DonationsTableProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">All Donations</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Donor Id</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Project</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((donation) => (
              <tr key={donation.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{donation.userId}</td>
                <td className="border border-gray-300 px-4 py-2">₹{donation.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{donation.projectTitle}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-gray-500 text-center py-4">
                No donations yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;
