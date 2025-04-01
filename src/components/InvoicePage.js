import React, { Component } from "react";
// import logo from "../icons/maurya.png";
import "../css/invoice.css";
import { calculateDiscountPercentage } from "./VariantReusable.js"; // Import reusable functions

class InvoicePage extends Component {
  state = {};

  render() {
    const { paymentDetails, cart } = this.props;
    // const{size}=this.props;
    // Destructure paymentDetails object
    const {
      InvoiceNumber,
      createdAt,
      _id,
      userEmail,
      deliveryAddress,
      paymentMethod,
      products,
      amountPaid,
      selectedUPIApp,
    } = paymentDetails;

    // Retrieve phoneNumber from localStorage
    const phoneNumber = localStorage.getItem("phoneNumber");

    let totalQuantity = 0;
    for (let i = 0; i < cart.length; i++) {
      totalQuantity += cart[i].variantQuantity;
    }

    const calculateTotal = () => {
      let total = 0;
      cart.forEach((item, index) => {
        const price = parseFloat(products[index].priceVariant); // Convert to number
        const quantity = parseInt(products[index].quantityVariant); // Convert to number
        if (!isNaN(price) && !isNaN(quantity)) {
          total += price * quantity; // Multiply price by quantity
        }
      });
      const shippingCost = 0; // Assuming shipping cost is $20
      total += shippingCost;
      return total;
    };

    return (
      <div className="invoice-container">
        {/* <img src={logo} alt="Company Logo" className="invoice-logo" /> */}
        <div
          className="logo-container invoice-logo"
          style={{ userSelect: "none", textDecoration: "none" }}
        >
          <a href="/" className="gow-logo">
            <span className="gow-main">GOW</span>
            <span className="gow-full">Galaxy of Wishes</span>
          </a>
        </div>
        <h1 className="invoice-header">Invoice - {InvoiceNumber}</h1>
        <div>
          <h3 style={{ color: "#666" }}>
            <strong>Tax Invoice Under Rule 46 0f CGST Rules 2017</strong>
          </h3>
          <h3 style={{ color: "#666" }}>
            <strong>
              Gallaxy Of Wishes ,Behram Baugh Jogeshwari (west) Mumbai <br />
              400-102, Maharashtra India
            </strong>
          </h3>
        </div>
        <div className="invoice-details">
          <div className="break"></div>
          <div className="invoice-section">
            <p>
              <strong>Order ID :</strong>
              <strong style={{ color: "red" }}>{_id}</strong>
            </p>

            <p>
              <strong>Date : </strong> {createdAt}
            </p>
            {phoneNumber &&
            phoneNumber.trim() !== "" &&
            phoneNumber.trim() !== "undefined" ? (
              <p>
                <strong>Contact Number : </strong> {phoneNumber}
              </p>
            ) : null}
            <p>
              <strong>User Email-Id : </strong> {userEmail}
            </p>
            <p>
              <strong>Delivery Address : </strong> {deliveryAddress}
            </p>
            <p>
              <strong>Payment Method : </strong> {paymentMethod}
            </p>
            <p>
              <strong>UPI App : </strong> {selectedUPIApp}
            </p>
          </div>
          {products && products.length > 0 && (
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
                  {products.map((product, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{product.brandName}</td>
                      <td>
                        {product.productName}({product.colorVariant}_
                        {product.sizeVariant})
                      </td>
                      <td>{product.quantityVariant}</td>
                      <td>{product.sizeVariant || ""}</td>
                      <td>
                        {calculateDiscountPercentage(
                          product?.mrpPriceVariant,
                          product?.priceVariant
                        )}
                        %
                      </td>
                      <td>{product.priceVariant}</td>
                      <td>{product.priceVariant * product.quantityVariant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="total-section">
            <div className="cart-shopping-total">
              <div className="total-item">
                <strong className="label-total">SubTotal :</strong>
                <span className="cart-shop-total">
                  &#8377;{calculateTotal()}
                </span>
              </div>
              <div className="total-item">
                <strong className="label-tax">Tax (12%) :</strong>
                <span className="cart-shop-total">
                  &#8377;{(calculateTotal() * 0.12).toFixed(2)}
                </span>
              </div>
              <div className="total-item">
                <strong className="label">Final Amount :</strong>
                <span className="cart-shop-total">
                  &#8377;{(calculateTotal() * 1.12).toFixed(2)}
                </span>
              </div>

              <div className="total-item">
                <strong className="label">Total Quantity:</strong>{" "}
                <span className="cart-shop-total">{totalQuantity}</span>
              </div>
              <div className="total-item">
                <strong className="label">Amount Paid:</strong>{" "}
                <span className="cart-shop-total">&#8377; {amountPaid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoicePage;
