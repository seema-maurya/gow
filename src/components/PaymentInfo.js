import React, { useState, useEffect } from "react";
import "../css/Proceedtopay.css";
import Pagination from "./Pagination/Pagination";
import { handleSearchKeyPress } from "./VariantReusable";
const PaymentInfo = () => {
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [filteredPaymentInfo, setFilteredPaymentInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [searchInput, setSearchInput] = useState("");
  const [hide, setHide] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (localStorage.getItem("userEmail")) {
      if (orderId) {
        fetchPaymentInfoById(orderId);
        setOrderId(orderId);
      } else {
        fetchPaymentInfo();
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPaymentInfoById = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}payment/getAll?id=${id}`
      );
      if (!response.ok) {
        window.location.href = "/order-list";
        throw new Error("Failed to fetch paymentInfo.");
      }
      const data = await response.json();
      console.log("GETALL ID", data);
      const paymentData = Array.isArray(data) ? data : [data];

      setPaymentInfo(paymentData);
      setFilteredPaymentInfo(paymentData);

      setHide(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching paymentInfo:", error.message);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/getAll"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch paymentInfo.");
      }
      const data = await response.json();
      console.log("PaymentInfo", data);
      setPaymentInfo(data);
      setFilteredPaymentInfo(data.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching paymentInfo:", error.message);
    }
  };

  const handleSearchInputChange = (e) => {
    const searchInput = e.target.value.toLowerCase().trim();
    setSearchInput(searchInput);

    if (searchInput === "") {
      setFilteredPaymentInfo(paymentInfo);
      setCurrentPage(1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  console.log("filteredPaymentInfo", filteredPaymentInfo);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredPaymentInfo.length / itemsPerPage);
  const currentItems = filteredPaymentInfo.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="payment-container" style={{ padding: "30px" }}>
      {isLoading ? (
        <div className="skeleton-loader">
          <div className="skeleton-heading"></div>
          <div className="skeleton-table">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-row">
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="filter">
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#074c96",
                color: "#bebaba",
                fontWeight: "bold",
              }}
            >
              Payment Details
              {hide ? (
                <input
                  style={{ borderRadius: "30px" }}
                  type="text"
                  placeholder="Search by OrderID and EmailId then press enter"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={(e) =>
                    handleSearchKeyPress(
                      e,
                      paymentInfo,
                      searchInput,
                      setFilteredPaymentInfo,
                      setCurrentPage
                    )
                  }
                />
              ) : (
                <> of OrderID : {orderId}</>
              )}
            </h2>
          </div>
          {currentItems.length > 0 ? (
            <>
              <ul>
                {currentItems.map((payment, index) => (
                  <li key={index}>
                    <div className="card-form">
                      <strong>Invoice No :</strong> {payment.InvoiceNumber}
                      <br />
                      <strong>Submitted Date :</strong> {payment.createdAt}
                      <br />
                      <strong>OrderID :</strong>{" "}
                      <strong style={{ color: "red" }}>{payment._id}</strong>
                      <br />
                      <strong>User EmailID :</strong> {payment.userEmail}
                      <br />
                      <div className="card-form">
                        <strong>Delivery Address :</strong>
                        <span className="delivery-address">
                          {payment.deliveryAddress}
                        </span>
                      </div>
                      <br />
                      <strong>Total Amount :</strong> {payment.amountPaid}
                      <br />
                      <div className="product-details">
                        <h3>Product Details</h3>
                        <div className="payment-row">
                          <div className="payment-heading">
                            <strong>SR No.</strong>
                          </div>
                          <div className="payment-heading">
                            <strong>Brand Name :</strong>
                          </div>
                          <div className="payment-heading">
                            <strong>Product Name :</strong>
                          </div>
                          <div className="payment-heading">
                            <strong>Unit Price :</strong>
                          </div>
                          <div className="payment-heading">
                            <strong> Size :</strong>
                          </div>
                          <div className="payment-heading">
                            <strong> Quantity :</strong>
                          </div>
                        </div>
                        <hr />
                        {payment.products && payment.products.length > 0 && (
                          <>
                            {payment.products.map((prod, index2) => (
                              <div className="payment-row" key={index2}>
                                <div className="payment-value">
                                  {index2 + 1}
                                </div>
                                <div className="payment-value">
                                  {prod.brandName && prod.brandName}
                                </div>
                                <div className="payment-value">
                                  {prod.productName && prod.productName}(
                                  {prod.colorVariant}_{prod.sizeVariant})
                                </div>
                                <div className="payment-value">
                                  {prod.priceVariant && prod.priceVariant}
                                </div>
                                <div className="payment-value">
                                  {prod.sizeVariant && prod.sizeVariant}
                                </div>
                                <div className="payment-value">
                                  {prod.quantityVariant && prod.quantityVariant}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      <strong>Total Product Quantity :</strong>{" "}
                      <strong style={{ color: "" }}>
                        {payment.totalQuantity}
                      </strong>
                      <br />
                      <strong>Payment Method :</strong>{" "}
                      <strong style={{ color: "red" }}>
                        {payment.paymentMethod}
                      </strong>
                      <br />
                      {payment.paymentMethod === "CardPayment" && (
                        <div className="card-form payment-details">
                          <strong>Card User Name : {payment.name}</strong>
                          <br />
                          <strong>Card Number : {payment.cardNumber}</strong>
                          <br />
                          <strong>CVV : {payment.cvv}</strong>
                          <br />
                          <strong>
                            Card Expiry Date : {payment.cardExpiryDate}
                          </strong>
                          <br />
                        </div>
                      )}
                      {payment.selectedUPIApp && (
                        <div className="card-form payment-details">
                          <strong>
                            selectedUPIApp :{" "}
                            <strong style={{ color: "green" }}>
                              {payment.selectedUPIApp}
                            </strong>
                            <br />
                          </strong>
                          {payment.mobileNumber && (
                            <strong>
                              mobileNumber :{" "}
                              <strong style={{ color: "" }}>
                                {payment.mobileNumber}
                              </strong>
                              <br />
                            </strong>
                          )}
                        </div>
                      )}
                      {payment.upiID && (
                        <div className="card-form payment-details">
                          <strong>Payment upiID : {payment.upiID}</strong>
                          <br />
                        </div>
                      )}
                      {payment.paymentStatus && (
                        <div className="card-form payment-details">
                          <strong>
                            Payment Status : {payment.paymentStatus}
                          </strong>
                          <br />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {!orderId && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  indexOfFirstItem={indexOfFirstItem}
                  indexOfLastItem={indexOfLastItem}
                  filteredPaymentInfo={filteredPaymentInfo}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          ) : (
            <h3>
              No payment records found for <strong>"{searchInput}"</strong>.{" "}
            </h3>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentInfo;
