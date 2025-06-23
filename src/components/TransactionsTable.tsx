import { Donation } from "../types";

const TransactionsTable: React.FC<{ transactions: Donation[] }> = ({ transactions }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-b">
              <td className="py-2 px-4">{txn.userId}</td>
              <td className="py-2 px-4">${txn.amount}</td>
              <td className="py-2 px-4">{new Date(txn.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  export default TransactionsTable;