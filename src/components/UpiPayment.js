import React, { useState } from "react";
import axios from "axios";

function UpiPayment() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "api/initiate-payment",
        {
          mobileNumber,
          amount,
        }
      );
      // Handle response, e.g., redirect to payment link
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <div>
      <h1>UPI Payment</h1>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}

export default UpiPayment;
