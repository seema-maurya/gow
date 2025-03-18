import React from "react";
import logo from "../icons/tyrelogo.jpg";
import "../css/invoice.css";
const InvoicePage = ({ paymentDetails, cart }) => {
  // Destructure paymentDetails object
  const {
    createdAt,
    _id,
    userEmail,
    deliveryAddress,
    paymentMethod,
    products,
    amountPaid,
  } = paymentDetails;
  const phoneNumber = localStorage.getItem("phoneNumber");

  let totalQuantity = 0;
  for (let i = 0; i < cart.length; i++) {
    totalQuantity += cart[i].quantity;
  }
  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item, index) => {
      const price = parseFloat(products[index].productPrice); // Convert to number
      const quantity = parseInt(item.quantity); // Convert to number
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
      <img src={logo} alt="Company Logo" className="invoice-logo" />{" "}
      {/* Add the image */}
      <h1 className="invoice-header">Invoice</h1>
      <div className="invoice-details">
        <div className="invoice-section">
          <p>
            <strong>Order ID :</strong>
            <strong style={{ color: "red" }}>{_id}</strong>
          </p>
          <p>
            <strong>Date:</strong> {createdAt}
          </p>
          {phoneNumber && (
            <p>
              <strong>Contact Number : </strong>
              {phoneNumber}
            </p>
          )}
          <p>
            <strong>User Email:</strong> {userEmail}
          </p>
          <p>
            <strong>Delivery Address:</strong> {deliveryAddress}
          </p>
          <p>
            <strong>Payment Method:</strong> {paymentMethod}
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
                  <th>Tyre Size</th>
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
                    <td>{product.productName}</td>
                    <td>{cart[index].quantity}</td>
                    <td>{product.size}</td>
                    <td>{Math.round(product.discount)} %</td>
                    <td>{product.productPrice}</td>
                    <td>{product.productPrice * cart[index].quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="invoice-section">
          <div className="cart-shopping-total">
            <div className="total-item">
              <strong className="label-total">SubTotal :</strong>
              <span className="cart-shop-total">&#8377;{calculateTotal()}</span>
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
              <span className="cart-shop-total">{amountPaid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
s;
