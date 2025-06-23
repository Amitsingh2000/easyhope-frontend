import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface DonationFormProps {
  projectId: string;
  projectTitle: string;
  onDonationSuccess: (newRaisedAmount: number) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({
  projectId,
  projectTitle,
  onDonationSuccess,
}) => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  const [name, setName] = useState<string>(isLoggedIn ? user.name : "Anonymous");
  const [email, setEmail] = useState<string>(isLoggedIn ? user.email : "Anonymous");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(!isLoggedIn);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const predefinedAmounts = [10, 25, 50, 100, 250];

  const resetForm = () => {
    setAmount(10);
    setCustomAmount(false);
    setIsAnonymous(!isLoggedIn);
    setName(isLoggedIn ? user.name : "Anonymous");
    setEmail(isLoggedIn ? user.email : "Anonymous");
  };

  const fetchUpdatedRaisedAmount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project data");
      const projectData = await response.json();
      onDonationSuccess(projectData.raisedAmount);
    } catch (error) {
      console.error("Error fetching updated raised amount:", error);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalUserId = user ? user.id : 0;
    const finalName = isAnonymous ? "Anonymous" : name;
    const finalEmail = isAnonymous ? "Anonymous" : email;

    try {
      const orderRes = await fetch("http://localhost:8080/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderRes.json();

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "EasyHope",
        description: `Donation to ${projectTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("http://localhost:8080/api/donations/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId,
              amount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              userId: finalUserId,
            }),
          });

          if (verifyRes.ok) {
            toast.success(`Thank you for donating ₹${amount} to "${projectTitle}"!`);
            fetchUpdatedRaisedAmount();
            resetForm();
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: finalName,
          email: finalEmail,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Donation Error:", err);
      toast.error("Something went wrong during donation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Make a Donation</h3>

      <form onSubmit={handleSubmit}>
        {/* 🔹 Amount selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !customAmount && amount === presetAmount
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setAmount(presetAmount);
                  setCustomAmount(false);
                }}
              >
                ₹{presetAmount}
              </button>
            ))}
            <button
              type="button"
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                customAmount
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setCustomAmount(true)}
            >
              Custom
            </button>
          </div>

          {customAmount && (
            <input
              type="number"
              className="block w-full mt-3 pl-3 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          )}
        </div>

        {/* 🔹 Name and Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
            value={isAnonymous ? "Anonymous" : name}
            onChange={(e) => setName(e.target.value)}
            required={!isAnonymous}
            disabled={isAnonymous || !isLoggedIn}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            value={isAnonymous ? "Anonymous" : email}
            onChange={(e) => setEmail(e.target.value)}
            required={!isAnonymous}
            disabled={isAnonymous || !isLoggedIn}
          />
        </div>

        {/* 🔹 Anonymous checkbox (only for logged-in users) */}
        {isLoggedIn && (
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="anonymous"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Donate anonymously
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Donate ₹${amount}`}
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Secure payment powered by Razorpay. By donating, you agree to our Terms of Service.
        </p>
      </form>
    </div>
  );
};

export default DonationForm;
