import React, { useState, useEffect } from "react";
import "../css/Proceedtopay.css";
import {
  // FaUser,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaMobileAlt,
  FaDownload,
  FaHome,
} from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import { handleClearCart } from "./cartFunctions.js";
import { useLocation, useNavigate } from "react-router-dom";

// import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import InvoicePage from "./InvoicePage.js";
// import { error } from "ajv/dist/vocabularies/applicator/dependencies.js";
// import logo from "../icons/GOW.png";

const ProceedToPay = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userEmail] = useState(localStorage.getItem("userEmail"));
  const [userId] = useState(localStorage.getItem("userId"));
  // const [showForm, setShowForm] = useState(true);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [upiID, setUpiID] = useState("");
  const [upiPaymentOption, setUpiPaymentOption] = useState("");
  const [selectedUPIApp, setSelectedUPIApp] = useState("");
  const [paymentUpdate, setPaymentUpdate] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisiblity, setIsVisiblity] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [upiLink, setUpiLink] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const { SubTotal, finalAmount, Tax, initialCart, size } =
    location.state || {};
  useEffect(() => {
    if (!SubTotal || !finalAmount || !initialCart) {
      // navigate("/");
      window.location = "/";
    } else {
      setCart(initialCart);
      calculateTotalQuantity(initialCart);
      // const total = cart.reduce((acc, item) => acc + item.variantQuantity, 0);
      // setTotalQuantity(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCart, SubTotal, finalAmount, navigate]);

  // Calculate total quantity of items in the cart
  const calculateTotalQuantity = async (cart) => {
    const total = cart.reduce((acc, item) => acc + item.variantQuantity, 0);
    await setTotalQuantity(total);
  };

  const handlePaymentRequest = async () => {
    try {
      if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
        alert("Please enter a valid amount greater than zero.");
        return;
      }

      const apiUrl =
        process.env.REACT_APP_API_URL +
        `payment/generate-upi-link?amount=${encodeURIComponent(finalAmount)}`;

      // Fetch request to generate UPI link
      const response = await fetch(apiUrl);

      // Handle non-200 HTTP responses
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Server error:", errorDetails);
        alert(
          `Error: ${errorDetails.message || "Unable to generate UPI link."}`
        );
        return;
      }

      // Parse response JSON
      const data = await response.json();

      if (data.upiLink && data.qrCode) {
        setUpiLink(data.upiLink);
        setQrCode(data.qrCode);
        alert("UPI link generated successfully.");
      } else {
        console.error("Invalid response format:", data);
        alert("Failed to generate UPI link. Please try again.");
      }
    } catch (error) {
      // Handle network errors and unexpected issues
      if (error.name === "TypeError") {
        console.error("Network error:", error);
        alert(
          "Network error: Please check your internet connection and try again."
        );
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("payment-container");

    const options = {
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // eslint-disable-next-line
    html2pdf().from(element).set(options).save();
  };

  // const handleProceedToPay = () => {
  //   setIsProcessing(true);

  //   setTimeout(() => {
  //     setPaymentSubmitted(true);
  //     setIsProcessing(false);
  //     setPaymentDetails({
  //       method: paymentMethod,
  //       upiOption: upiPaymentOption,
  //       cardDetails: {
  //         name,
  //         cardNumber,
  //         expiryMonth,
  //         expiryYear,
  //       },
  //       totalQuantity,
  //       SubTotal,
  //       finalAmount,
  //     });
  //   }, 2000);
  // };

  const handlePayment = async () => {
    // const { SubTotal, finalAmount, cart, Tax, size } = props;
    // const products = cart.map((item) => item._id);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryMonthInt = parseInt(expiryMonth, 10);
    const expiryYearInt = parseInt(expiryYear, 10);

    if (!userEmail) {
      alert(` Please Login! `);
      return;
    }
    if (deliveryAddress.length < 30) {
      alert("Delivery address must be at least 30 characters long.");
      return;
    }

    if (!size) {
      alert("Please select a size ");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === "CardPayment") {
      if (!name) {
        alert("Please enter a valid name ");
        return;
      }
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Please enter a valid card number 16 digits");
        return;
      }
      if (!cvv || cvv.length !== 3) {
        alert("Please enter a valid CVV (3 digits).");
        return;
      }

      if (!expiryMonth || !expiryYear) {
        alert("Please enter a valid expiry date mm yyyy.");
        return;
      }
    }
    if (
      paymentMethod === "CardPayment" &&
      (expiryYearInt < currentYear ||
        (expiryYearInt === currentYear && expiryMonthInt < currentMonth))
    ) {
      alert("Please enter a valid expiry date.");
      return;
    }

    if (paymentMethod === "CashOnDelivery") {
      if (!paymentUpdate) {
        alert("Please select payment status for Pay on Delivery.");
        return;
      }
    }

    if (paymentMethod === "Online") {
      if (!selectedUPIApp && !upiID && !upiLink && !qrCode) {
        alert(
          "Please select either Your UPI Apps or provide UPI ID or Generate UPI Link."
        );
        return;
      }
      if (selectedUPIApp && !mobileNumber) {
        setMobileNumberError("Please enter a 10 digit mobile number");
        return false;
      } else {
        setMobileNumberError("");
      }
      if (upiLink && !transactionId) {
        alert("Please enter a transactionId");
        return false;
      }
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(userEmail && { userEmail }),
            ...(deliveryAddress && { deliveryAddress }),
            ...(paymentMethod && { paymentMethod }),
            ...(totalQuantity && { totalQuantity }),
            ...(SubTotal && { SubTotal }),
            ...(finalAmount && { amountPaid: finalAmount }),
            ...(Tax && { Tax }),
            ...(initialCart && {
              products: initialCart.map((item) => ({
                id: item._id,
                quantity: item.variantQuantity,
                color: item.selectedColor,
                size: item.selectedSizes,
                price: item.variantPrice,
                mrpPrice: item.variantMrpPrice,
              })),
            }),
            // ...(size && { size }),
            ...(selectedUPIApp && { selectedUPIApp }),
            ...(mobileNumber && { mobileNumber }),
            ...(upiID && { upiID }),
            ...(name && { name }),
            ...(cardNumber && { cardNumber }),
            ...(cvv && { cvv }),
            ...(expiryMonth &&
              expiryYear && { expiryDates: `${expiryMonth}/${expiryYear}` }),
            ...(paymentUpdate && { paymentUpdate }),
            ...(transactionId && { transactionId }),
            // pdfData: document.getElementById("payment-container").innerHTML,
          }),
        }
      );
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to store payment information.");
      }

      if (paymentUpdate === "PaymentPending") {
        alert(
          `Payment Pending! Your order will be delivered to: ${deliveryAddress} \nPayment Method: ${paymentMethod}\nAmount Paid: ${finalAmount}`
        );
      } else if (paymentUpdate === "PaymentReceived") {
        alert(
          `Payment Received! Your  order will be delivered to: ${deliveryAddress} \nPayment Method: ${paymentMethod}\nAmount paid: ${finalAmount}    `
        );
      } else {
        alert(
          `Payment successful! Your order will be delivered to: ${deliveryAddress}\nPayment Method: ${paymentMethod}\nAmount Paid: ${finalAmount}`
        );
      }
      if (userId) {
        handleClearCart(setCart, true);
      } else {
        localStorage.removeItem("cart");
      }

      resetFields(); // Reset all fields
    } catch (error) {
      console.error("Error storing payment information:", error.message);
      alert("Payment failed. Please try again later.");
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/getAll"
      );
      const data = await response.json();
      const data1 = data.reverse();
      console.log("Now", data1[0]);
      const productsInfo = data1[0].products
        .map((product, index) => {
          return `Product ${index + 1}:
    Brand Name: ${product.brandName}
    Model:      ${product.productName}
    Quantity:   ${product.quantityVariant}
    Size:       ${product.sizeVariant}
    mrp:        ${product.mrpPriceVariant}
    Price:      ${product.priceVariant}\n`;
        })
        .join("");

      const splitAddress = (address) => {
        const maxCharactersPerLine = 15;
        const lines = [];
        let currentLine = "";
        address &&
          address.split(" ").forEach((word) => {
            if ((currentLine + word).length > maxCharactersPerLine) {
              lines.push(currentLine.trim());
              currentLine = "";
            }
            currentLine += word + " ";
          });
        lines.push(currentLine.trim());
        return lines.join("\n");
      };

      // Example usage
      const formattedDeliveryAddress = splitAddress(deliveryAddress);
      const paymentDetails = `
        Invoice : ${data1[0].InvoiceNumber}
        Date: ${data1[0].createdAt}
        OrderID: ${data1[0]._id}
        User Email: ${userEmail}
        Delivery Address: ${formattedDeliveryAddress}
        Payment Method: ${paymentMethod}
        UpiApp :${selectedUPIApp}
        Products:
        ${productsInfo}
    
        Final Amount: ${finalAmount}
    `;
      console.log("PAYMENTDETAILS", paymentDetails);
      setPaymentSubmitted(true);
      setPaymentDetails(data1[0]);
      setIsVisiblity(false);
      setCart([]);
      setTimeout(async () => {
        await handleDownloadPDF();
      }, 100); // Wait for 100 milliseconds
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 10000); // Delay of 3000 milliseconds (3 seconds)
    } catch (fetchError) {
      console.error("Error fetching payment details:", fetchError.message);
      alert("Could not retrieve payment details. Please try again later.");
    }
  };

  const resetFields = () => {
    setDeliveryAddress("");
    setPaymentMethod("");
    setCvv("");
    setExpiryMonth("");
    setExpiryYear("");
    setName("");
    setCardNumber("");
    setUpiID("");
    setSelectedUPIApp("");
    setPaymentUpdate("");
  };

  const handleCVVChange = (e) => {
    const cvv = e.target.value.replace(/\D/g, "");
    setCvv(cvv);
  };

  const handleExpiryMonthChange = (e) => setExpiryMonth(e.target.value);
  const handleExpiryYearChange = (e) => setExpiryYear(e.target.value);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ");
    value = value.slice(0, 19);
    setCardNumber(value.trim());
  };

  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value.replace(/\D/g, "");
    const isValidFormat = mobileNumber.length === 10;
    setMobileNumber(mobileNumber);
    setMobileNumberError(
      isValidFormat ? "" : "Please enter a 10 digit mobile number"
    );
  };

  // render() {
  //   const { cart, size, finalAmount } = props;
  //   const { selectedBank, mobileNumber } = state;
  const bankOptions = [
    { value: "", label: "Select Bank" },
    { value: "SBI", label: "State Bank of India" },
    { value: "Axis", label: "Axis Bank" },
    { value: "BoB", label: "Bank of Baroda" },
  ];

  // Generate options for year dropdown (current year to next 10 years)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const expiryMonthInt = parseInt(expiryMonth, 10);
  const expiryYearInt = parseInt(expiryYear, 10);

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    <option key="0" value="" defaultValue>
      YYYY
    </option>, // Placeholder
    ...Array.from({ length: 21 }, (_, i) => {
      const year = currentYear + i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    }),
  ];

  const monthOptions = [
    <option key="0" value="" defaultValue>
      MM
    </option>,
    ...Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      return (
        <option key={month} value={month}>
          {month}
        </option>
      );
    }),
  ];

  return (
    <div>
      <>
        {/* {!isButtonDisabled && isVisiblity && initialCart.length > 0 && (
            <button
              className="proceed"
              // style={{ width: "20%" }}
              onClick={handleProceedToPay}
              disabled={isButtonDisabled}
            >
              Proceed to pay
            </button>
          )} */}

        {isProcessing && (
          <div className="overlay">
            <div className="processing-modal">
              <div className="spinner"></div>
              <p>
                <span className="processing">Payment Processing</span>
                {/* <div className="processing">
                        <img src={logo} alt="Logo" />
                      </div> */}

                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </p>
            </div>
          </div>
        )}
        {isVisiblity && cart && initialCart && (
          <div className="payment-form ">
            {/* <strong style={{ marginRight: "110px" }}>
              <FaUser /> User Email :{" "}
            </strong>
            <strong>{localStorage.getItem("userEmail")}</strong> */}
            <br />
            {initialCart &&
              initialCart.map((item, index) => (
                <div key={index}>
                  <strong style={{ marginRight: "120px" }}>Brand Name :</strong>
                  <strong>{item.brandName}</strong>
                  <br />
                  <strong style={{ marginRight: "160px" }}>Model :</strong>
                  <strong>
                    {item.productName}({item.selectedColor}_{item.selectedSizes}
                    )
                  </strong>
                  <br />
                  <strong style={{ marginRight: "145px" }}>Quantity :</strong>
                  <strong>{item.variantQuantity}</strong>
                  <br />
                  <strong style={{ marginRight: "180px" }}> Size :</strong>
                  <strong>{item.selectedSizes || ""}</strong>
                  <br />
                  <strong style={{ marginRight: "145px" }}>Price/pcs :</strong>
                  <strong>{item.variantPrice}</strong>
                  <br />

                  {/* <p>Model: {item.productName}</p> */}
                  {/* Display other details here */}
                  <hr />
                </div>
              ))}
            <strong style={{ marginRight: "150px" }}>Total Quantity :</strong>
            <strong>{totalQuantity}</strong>
            <br />
            <strong style={{ marginRight: "50px" }}>
              <FaRupeeSign /> Final Amount to Pay :
            </strong>
            <strong>
              {" "}
              <FaRupeeSign />
              {finalAmount}
            </strong>
            <br />
            <strong>
              <FaTruck /> Delivery Address
              <span style={{ color: "red" }}>*</span>:{" "}
            </strong>
            <input
              style={{
                marginLeft: "45px",
                borderColor:
                  deliveryAddress && deliveryAddress.length >= 30 ? "" : "red",
              }}
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
            />{" "}
            <FaMapMarkerAlt />
            <br />
            <strong>
              <FaCreditCard /> Select Payment Method
              <span style={{ color: "red" }}>*</span>:{" "}
            </strong>{" "}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ borderColor: paymentMethod ? "" : "red" }}
            >
              <option value="">Select payment method</option>
              <option value="Online">Online Payment</option>
              <option value="CashOnDelivery">Pay on Delivery</option>
              <option value="CardPayment">Card Payment</option>
              <option value="EMI">EMI</option>
            </select>
            {paymentMethod === "CardPayment" && (
              <div className="card-form">
                <>
                  <br />
                  <strong style={{ marginRight: "143px" }}>
                    Name<span style={{ color: "red" }}>*</span>:{" "}
                  </strong>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ borderColor: name ? "" : "red" }}
                  />
                  <br />

                  {/* Card Number */}
                  <strong style={{ marginRight: "93px" }}>
                    Card Number<span style={{ color: "red" }}>*</span>:{" "}
                  </strong>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="Enter card number"
                    style={{
                      borderColor:
                        cardNumber && cardNumber.length === 19 ? "" : "red",
                    }}
                  />
                  <br />
                  <strong>
                    CVV<span style={{ color: "red" }}>*</span>:
                  </strong>
                  <input
                    style={{
                      width: "10%",
                      borderColor: cvv.length === 3 ? "" : "red",
                    }}
                    type="text"
                    value={cvv}
                    onChange={handleCVVChange}
                    placeholder="Enter CVV"
                  />
                  {"    "}
                  <strong>
                    Expiry Date<span style={{ color: "red" }}>*</span>:
                  </strong>
                  <select
                    style={{
                      width: "15%",
                      borderColor:
                        (expiryYearInt === currentYear &&
                          expiryMonthInt >= currentMonth) ||
                        expiryYearInt > currentYear
                          ? ""
                          : "red",
                    }}
                    title="select the month of expiry card"
                    name="expiryMonth"
                    value={expiryMonth}
                    onChange={handleExpiryMonthChange}
                  >
                    {monthOptions}
                  </select>
                  <strong> {" /"}</strong>
                  <select
                    style={{
                      width: "15%",
                      borderColor: expiryYear ? "" : "red",
                    }}
                    title="select the year of expiry card"
                    name="expiryYear"
                    value={expiryYear}
                    onChange={handleExpiryYearChange}
                  >
                    {yearOptions}
                  </select>
                </>
              </div>
            )}
            {paymentMethod === "Online" && (
              <div className="card-form">
                <>
                  <br />
                  <strong>
                    {" "}
                    <FaMobileAlt />
                    UPI Payment Option
                    <span style={{ color: "red" }}>*</span> :
                  </strong>
                  <select
                    value={upiPaymentOption}
                    onChange={(e) => setUpiPaymentOption(e.target.value)}
                    style={{
                      marginLeft: "8px",
                      borderColor: upiPaymentOption ? "" : "red",
                    }}
                  >
                    <option value="">Select UPI Payment Option</option>
                    <option value="GenerateUPILink">Generate UPI Link </option>
                    <option value="Your UPI Apps">Your UPI Apps</option>
                    <option value="UPI ID">UPI ID</option>
                  </select>
                  {upiPaymentOption === "Your UPI Apps" && (
                    <>
                      <br />
                      <strong>
                        Select UPI App<span style={{ color: "red" }}>*</span> :
                      </strong>
                      <select
                        value={selectedUPIApp}
                        onChange={(e) => setSelectedUPIApp(e.target.value)}
                        style={{
                          marginLeft: "45px",
                          borderColor: selectedUPIApp ? "" : "red",
                        }}
                      >
                        <option value="">Select UPI App</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="PayTm">PayTm</option>
                        <option value="GooglePay">GooglePay</option>
                      </select>
                      {"   "}
                      <div>
                        <input
                          type="text"
                          id="mobileNumber"
                          value={mobileNumber}
                          onChange={handleMobileNumberChange}
                          placeholder="Enter mobile number"
                          maxLength={10}
                        />
                        {mobileNumberError && (
                          <p style={{ color: "red", fontSize: "0.8rem" }}>
                            {mobileNumberError}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {upiPaymentOption === "UPI ID" && (
                    <>
                      <br />
                      <strong>
                        UPI ID<span style={{ color: "red" }}>*</span> :{" "}
                      </strong>
                      <input
                        type="text"
                        value={upiID}
                        onChange={(e) => setUpiID(e.target.value)}
                        placeholder="Enter UPI ID"
                        style={{
                          marginLeft: "97px",
                          borderColor: upiID ? "" : "red",
                        }}
                      />
                      {upiID ? null : (
                        <p style={{ color: "red" }}>
                          Please enter a valid UPI ID format: UserName@BankName
                          or PhoneNumber@BankName
                        </p>
                      )}
                    </>
                  )}
                  {upiPaymentOption === "GenerateUPILink" && (
                    <>
                      <br />
                      <button
                        onClick={handlePaymentRequest}
                        style={{ marginLeft: "10px" }}
                      >
                        Generate Payment Link
                      </button>
                      {upiLink && (
                        <div style={{ marginTop: "20px" }}>
                          <p>Click the link below to pay:</p>
                          <a
                            href={upiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Pay Now
                          </a>
                        </div>
                      )}
                      {qrCode && (
                        <div>
                          <p>Scan the QR code to pay:</p>
                          <img src={qrCode} alt="UPI QR Code" />
                        </div>
                      )}{" "}
                      <br />
                      <strong>
                        Transaction ID<span style={{ color: "red" }}>*</span> :{" "}
                      </strong>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter Transaction ID"
                        style={{
                          marginLeft: "40px",
                          borderColor: transactionId ? "" : "red",
                        }}
                      />
                      {transactionId ? null : (
                        <p style={{ color: "red" }}>
                          Please enter a valid transaction ID format
                        </p>
                      )}
                    </>
                  )}
                </>
              </div>
            )}
            <br />{" "}
            {paymentMethod === "CashOnDelivery" && (
              <div className="card-form">
                <br />
                <strong>
                  <GiDeliveryDrone />
                  Pay on Delivery Status
                  <span style={{ color: "red" }}>*</span> :{"   "}
                </strong>
                <select
                  value={paymentUpdate}
                  onChange={(e) => setPaymentUpdate(e.target.value)}
                  style={{
                    color:
                      paymentUpdate === "PaymentReceived" ? "green" : "red",
                  }}
                >
                  <option value="">Select payment status</option>
                  <option value="PaymentPending">Payment Pending</option>
                  <option value="PaymentReceived">Payment Received</option>
                </select>
                <FaMobileAlt />
              </div>
            )}
            <br />
            {paymentMethod === "EMI" && (
              <div className="card-form">
                <br />
                <strong>
                  <GiDeliveryDrone />
                  EMI : <span style={{ color: "red" }}>*</span> :{"   "}
                </strong>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  style={{
                    marginLeft: "8px",
                    borderColor: selectedBank ? "" : "red",
                  }}
                >
                  {bankOptions.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
                <FaMobileAlt />
              </div>
            )}
            <button onClick={handlePayment}>
              Proceed to Buy ({totalQuantity} items)
            </button>{" "}
            {paymentSubmitted && (
              <>
                <FaDownload
                  className="downloadPDFButton"
                  onClick={handleDownloadPDF}
                  title="Invoice Download PDF "
                />
              </>
            )}
          </div>
        )}
      </>
      {paymentSubmitted && (
        <>
          <h2 style={{ marginTop: "20px" }}>
            <strong>
              <FaDownload
                className="downloadPDFButton"
                onClick={handleDownloadPDF}
                title="Invoice Download PDF "
              />
            </strong>
            <p className="forgot-password text-right">
              <FaHome style={{ marginRight: "5px" }} />
              <a href="/">Home</a>
            </p>
          </h2>
          <div id="payment-container">
            <InvoicePage
              paymentDetails={paymentDetails}
              cart={initialCart}
              size={size}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProceedToPay;
