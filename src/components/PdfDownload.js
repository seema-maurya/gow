import React, { useState, useEffect } from "react";
// import logo from "../icons/maurya.png";
import "../css/invoice.css";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import { calculateDiscountPercentage } from "./VariantReusable.js"; // Import reusable functions
import Pagination from "./Pagination/Pagination.js";

const PdfDownload = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    fetchInvoices(userEmail);
  }, []);

  const handleItemsPerPageChange = (e) => {
    const itemsPerPage = parseInt(e.target.value);
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleDownloadPDF = (invoiceId) => {
    const element = document.getElementById(`invoice-container-${invoiceId}`);
    const elementsToBreak = element.querySelectorAll(".break");
    elementsToBreak.forEach((el, index) => {
      if (index > 0) {
        el.classList.add("page-break");
      }
    });

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `invoice-${invoiceId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    // eslint-disable-next-line
    html2pdf().from(element).set(options).save();
  };

  const fetchInvoices = async (userEmail) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        console.error("API URL is not defined in the environment variables.");
        return;
      }

      const response = await axios.get(
        `${apiUrl}payment/getInvoice?userEmail=${userEmail}`
      );
      console.log("/getInvoice", response);
      if (response && response.data && Array.isArray(response.data)) {
        setInvoices(response.data.reverse());
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with a status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up the request:", error.message);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div>
      {invoices.length === 0 ? (
        <div>
          <strong>
            <h1>No Data</h1>
          </strong>
        </div>
      ) : (
        currentItems.map((invoice, index) => (
          <div key={index}>
            <h2 style={{ marginTop: "20px" }}>
              <strong>
                <FaDownload
                  style={{ marginLeft: "200px", color: "red" }}
                  className="downloadPDFButton"
                  onClick={() => handleDownloadPDF(invoice._id)}
                  title="Invoice Download PDF"
                />{" "}
                Download Invoice No : {invoice.InvoiceNumber}{" "}
              </strong>
            </h2>
            <div
              className="invoice-container"
              id={`invoice-container-${invoice._id}`}
              key={invoice._id}
            >
              {/* <img src={logo} alt="Company Logo" className="invoice-logo" /> */}
              <div
                className="logo-container "
                style={{ userSelect: "none", textDecoration: "none" }}
              >
                <a href="/" className="gow-logo">
                  <span className="gow-main">GOW</span>
                  <span className="gow-full">Galaxy of Wishes</span>
                </a>
              </div>
              <h1 className="invoice-header">
                Invoice - {invoice.InvoiceNumber}
              </h1>
              <div>
                <h3 style={{ color: "#666" }}>
                  <strong>Tax Invoice Under Rule 46 0f CGST Rules 2017</strong>
                </h3>
                <h3 style={{ color: "#666" }}>
                  <strong>
                    Galaxy Of Wishes ,Behram Baugh Jogeshwari (west) Mumbai{" "}
                    <br />
                    400-102, Maharashtra India
                  </strong>
                </h3>
              </div>
              <div className="invoice-details">
                <div className="invoice-section">
                  <p>
                    <strong>Order ID : </strong>
                    <strong style={{ color: "red" }}>{invoice._id}</strong>
                  </p>

                  <p>
                    <strong>Date : </strong> {invoice.createdAt}
                  </p>
                  {invoice.phoneNumber && (
                    <p>
                      <strong>Contact Number : </strong> {invoice.phoneNumber}
                    </p>
                  )}
                  <p>
                    <strong>User Email-Id : </strong> {invoice.userEmail}
                  </p>
                  <p>
                    <strong>Delivery Address : </strong>{" "}
                    {invoice.deliveryAddress}
                  </p>
                  <p>
                    <strong>Payment Method : </strong> {invoice.paymentMethod}
                  </p>
                  {invoice.selectedUPIApp && (
                    <p>
                      <strong>UPI App : </strong> {invoice.selectedUPIApp}
                    </p>
                  )}
                  {invoice.paymentStatus && (
                    <p>
                      <strong>Payment Status : </strong> {invoice.paymentStatus}
                    </p>
                  )}
                  {invoice.transactionId && (
                    <p>
                      <strong>TransactionId: </strong> {invoice.transactionId}
                    </p>
                  )}
                </div>
                {invoice.products && invoice.products.length > 0 && (
                  <div className="invoice-section">
                    <h2>Products</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Brand Name</th>
                          <th>Model</th>
                          <th>Quantity</th>
                          <th>Size</th>
                          <th>Discount</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice?.products?.map((product, index) => (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{product.brandName}</td>
                            <td>
                              {" "}
                              {product?.productName}({product?.colorVariant}_
                              {product?.sizeVariant})
                            </td>
                            <td>{product?.quantityVariant}</td>
                            <td>{product?.sizeVariant}</td>
                            <td>
                              {calculateDiscountPercentage(
                                product?.mrpPriceVariant,
                                product?.priceVariant
                              )}
                              %
                            </td>
                            <td>{product?.priceVariant}</td>
                            <td>
                              {product?.priceVariant *
                                product?.quantityVariant || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="total-section">
                  <div className="cart-shopping-total">
                    <div className="total-item">
                      <strong className="label">Total Quantity:</strong>{" "}
                      <span className="cart-shop-total">
                        {invoice.totalQuantity}
                      </span>
                    </div>
                    <div className="total-item">
                      <strong className="label-total">SubTotal :</strong>
                      <span className="cart-shop-total">
                        &#8377;
                        {invoice.SubTotal}
                      </span>
                    </div>
                    <div className="total-item">
                      <strong className="label-tax">Tax (12%) :</strong>
                      <span className="cart-shop-total">
                        &#8377;{invoice.Tax}
                      </span>
                    </div>
                    <div className="total-item">
                      <strong className="label">Final Amount :</strong>
                      <span className="cart-shop-total">
                        &#8377;{invoice.amountPaid}
                      </span>
                    </div>
                    <div className="total-item">
                      <strong className="label">Amount Paid :</strong>
                      <span
                        className="cart-shop-total"
                        style={{ color: "green" }}
                      >
                        &#8377;{invoice.amountPaid}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      {invoices.length > 0 && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredPaymentInfo={invoices}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
      ;
    </div>
  );
};

export default PdfDownload;
