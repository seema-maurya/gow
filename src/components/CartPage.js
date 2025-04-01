import React, { useState, useEffect } from "react";
import { FaTimes, FaMinus, FaPlus, FaTrash, FaSyncAlt } from "react-icons/fa";
import "../css/Cart/CartPage.css";
import { SizeChart, SizeGuide, SecureTransaction } from "./OfferDetails";
import OfferDiscounts from "./OfferDiscounts.js";
// import ChatBox from "./ChatBox";
// import logo from "../icons/maurya.png";
import { Link, useNavigate } from "react-router-dom";

import {
  // handleSizeChange,
  handleRefreshPage,
  handleRemoveFromCartVariant,
  handleClearCart,
  calculateTotal,
  // fetchAllCart,
  handleVariantAddToCart,
  handleRemoveFromCart2Variant,
} from "./cartFunctions.js";

import { calculateDiscountPercentage } from "./VariantReusable.js"; // Import reusable functions
import { useCart } from "./CartContext.js";
import SearchResults from "./SearchResults.js";
const CartPage = () => {
  // const [cart, setCart] = useState([]);
  // const [selectedSizes, setSelectedSizes] = useState(
  //   JSON.parse(localStorage.getItem("selectedSizes")) || {}
  // );
  const { cart, setCart, selectedSizeVariants, setSelectedSizeVariants } =
    useCart();
  const selectedSizes = selectedSizeVariants;
  const setSelectedSizes = setSelectedSizeVariants;
  const [isProcessing, setIsProcessing] = useState(false);
  const isVisible = true;
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProceedToPayClick = () => {
    navigate("/proceedToPay", {
      state: {
        SubTotal,
        finalAmount: finalAmountToPay,
        Tax,
        initialCart: cart,
        size: selectedSizes,
      },
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // fetchAllCart(setCart, setSelectedSizes);
    } else {
      // const storedCart = JSON.parse(localStorage.getItem("carts")) || [];
      // setCart(storedCart);
    }
    localStorage.removeItem("cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("CartPage", cart);

  const SubTotal = calculateTotal(cart);
  const finalAmountToPay = (SubTotal * 1.12).toFixed(2);
  const Tax = (SubTotal * 0.12).toFixed(2);

  const findCartItem = (productId) => {
    return cart.find((item) => item._id === productId);
  };

  const addToCartVariant = async (product) => {
    const variant = product.variant;
    if (!product.selectedSizes && product.selectedColor) {
      alert("Please select a valid size and color");
      return;
    }

    setIsProcessing(true);
    // await new Promise((resolve) => setTimeout(resolve, 500));
    await handleVariantAddToCart(
      product,
      cart,
      setCart,
      product.selectedSizes,
      setSelectedSizes,
      product.selectedColor,
      variant.quantity,
      product.variantPrice,
      product.variantMrpPrice
    );
    setIsProcessing(false);
  };

  let totalQuantity = 0;
  cart.forEach((item) => {
    totalQuantity += item.variantQuantity;
  });
  const handleRemoveWrapper = async (index, cart, setCart, productId) => {
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true);
    try {
      await handleRemoveFromCartVariant(index, cart, setCart, productId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isProcessing && (
        <div className="overlay">
          <div className="processing-modal">
            <div className="spinner"></div>
            <p>
              <span className="processing">Item adding</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </p>
          </div>
        </div>
      )}

      {cart.length > 0 ? (
        <>
          <div style={{ marginBottom: "10px" }}>
            {/* <ChatBox /> */}
            <h2 className="cart-heading">
              {/* <div className="" title="Maurya" style={{ userSelect: "none" }}>
                  <a href="/">
                    <img
                      src={logo}
                      alt="My-first-design-2"
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "10px",
                      }}
                    />
                  </a>
                </div> */}
              <div
                className="logo-container"
                style={{
                  userSelect: "none",
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              >
                <a href="/" className="gow-logo">
                  <span className="gow-main">GOW</span>
                  <span className="gow-full">Galaxy of Wishes</span>
                </a>
              </div>
              <span
                style={{ marginLeft: "50px" }}
                className="cart-heading-text"
                title="Cart Item List"
              >
                Cart Items :{" "}
                <span className="count-style">
                  {cart &&
                    cart.reduce(
                      (total, item) => total + item.variantQuantity,
                      0
                    )}
                </span>
                <FaSyncAlt
                  color="#827f7f"
                  title="Refresh"
                  style={{
                    marginLeft: "20px",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  className="refresh-button"
                  onClick={handleRefreshPage}
                />
              </span>
              <FaTrash
                className="clear-cart-button"
                style={{ fontSize: "20px", color: "white" }}
                title="Clear Cart"
                onClick={() => handleClearCart(setCart)}
              />
            </h2>
            <div className="cart-page-container">
              {/* Left Side: Cart Items (60%) */}
              <div className="cart-items-section">
                <ul>
                  {cart.map((item, index) => {
                    const cartItem = findCartItem(item._id);
                    const isProductInCart = !!cartItem;
                    const isCartQuantityMaxedVariant =
                      isProductInCart &&
                      item.variantQuantity >= item.variant.quantity;
                    // Filter the product images based on the selected color
                    const matchingImage =
                      item.productImages &&
                      item.productImages
                        ?.filter(
                          (image) =>
                            image.color.toLowerCase() ===
                            item.selectedColor.toLowerCase()
                        )
                        .find(
                          (image) => !image?.dataURL?.startsWith("data:video/")
                        );
                    return (
                      <li key={index}>
                        <div
                          className="cart-item-container"
                          style={{ width: "" }}
                        >
                          <div className="cart-image-container">
                            {matchingImage ? (
                              <img
                                alt={item.productName}
                                src={matchingImage.dataURL} // Display the matching image
                                className="cart-image"
                                onClick={() =>
                                  (window.location.href = `/product?id=${item._id}&color=${item.selectedColor}&size=${item.selectedSizes}`)
                                }
                              />
                            ) : (
                              <p>No image available for the selected color.</p>
                            )}
                          </div>
                          <div className="cart-remove-container">
                            <FaTrash
                              title="Remove-Item"
                              className="cart-remove"
                              onClick={() =>
                                handleRemoveWrapper(
                                  index,
                                  cart,
                                  setCart,
                                  item._id
                                )
                              }
                              disabled={isProcessing}
                            />
                          </div>

                          <div className="cart-details">
                            <Link
                              to={`/search-results?query=${item.brandName}`}
                            >
                              <p>
                                <strong
                                  style={{ justifyContent: "space-between" }}
                                >
                                  Brand Name:
                                </strong>{" "}
                                {item.brandName}
                              </p>
                            </Link>
                            <Link
                              to={`/product?id=${item._id}&color=${item.selectedColor}&size=${item.selectedSizes}`}
                              key={index}
                            >
                              <p>
                                <strong style={{ cursor: "pointer" }}>
                                  Model : {item.productName}(
                                  {item.selectedColor}_{item.selectedSizes})
                                </strong>
                              </p>
                            </Link>
                            <p>
                              <strong>Size : </strong>
                              {item.selectedSizes}
                            </p>
                            {item.selectedColor && (
                              <p>
                                <strong>Colour :</strong> {item.selectedColor}
                              </p>
                            )}
                            <p>
                              <strong>Available Stock :</strong>{" "}
                              {item.variant?.quantity - item.variantQuantity}
                            </p>
                            {calculateDiscountPercentage(
                              item.variantMrpPrice,
                              item.variantPrice
                            ) > 75 && (
                              <p className="limited-time-offer">
                                Limited Time Deal
                              </p>
                            )}
                            <span style={{ color: "red" }}>
                              {calculateDiscountPercentage(
                                item.variantMrpPrice,
                                item.variantPrice
                              )}
                              % off
                            </span>
                            <p>
                              <strong>Price:</strong> {item.variantPrice}/pcs
                            </p>
                            <p className="mrp">
                              <strong>MRP:</strong> ₹ {item.variantMrpPrice}
                            </p>
                            <div className="cart-quantity-controls">
                              <FaMinus
                                className={
                                  item.variantQuantity > 1
                                    ? "cart-quantity-button minus"
                                    : "cart-quantity-button minus disabled"
                                }
                                onClick={() =>
                                  item.variantQuantity > 1 &&
                                  handleRemoveFromCart2Variant(
                                    item,
                                    cart,
                                    setCart,
                                    item.selectedSizes,
                                    setSelectedSizes,
                                    item.selectedColor,
                                    setIsProcessing
                                    // item.variant.quantity,
                                  )
                                }
                              />
                              <div
                                className="cart-quantity-display"
                                style={{
                                  userSelect: "none",
                                  pointerEvents: "none",
                                }}
                              >
                                {item.variantQuantity}
                              </div>
                              <FaPlus
                                className="cart-quantity-button plus"
                                onClick={() =>
                                  !isCartQuantityMaxedVariant &&
                                  addToCartVariant(item)
                                }
                                style={{
                                  cursor: isCartQuantityMaxedVariant
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: isCartQuantityMaxedVariant ? 0.5 : 1,
                                }}
                                title={
                                  isCartQuantityMaxedVariant
                                    ? `This seller has only ${item.variant.quantity} of these available. To see if more are available from another seller, go to the product detail page.`
                                    : "Add to Cart"
                                }
                              />
                            </div>

                            <div>
                              <OfferDiscounts />
                              {/* <SizeChart /> */}
                              {/* <SizeGuide /> */}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* </div>
                <div className="search-results-section">
                  <SearchResults
                    productName={cart.length > 0 ? cart[0].productName : ""}
                  />
                </div>
              </div> */}
                <div className="cart-shopping-total">
                  <strong>
                    The price and availability of items at Amazon.in are subject
                    to change. The shopping cart is a temporary place to store a
                    list of your items and reflects each item's most recent
                    price.
                  </strong>
                  <div className="total-item">
                    <strong className="label-total">
                      SubTotal({totalQuantity} item) :
                    </strong>
                    <span className="cart-shop-total">&#8377;{SubTotal}</span>
                  </div>
                  <div className="total-item">
                    <strong className="label-tax">Tax (12%) :</strong>
                    <span className="cart-shop-total">&#8377;{Tax}</span>
                  </div>
                  <div className="total-item">
                    <strong className="label">Final Amount to Pay :</strong>
                    <span className="cart-shop-total">
                      &#8377;{finalAmountToPay}
                    </span>
                  </div>
                  <SecureTransaction />
                </div>
              </div>
              <div className="search-results-section">
                <div
                  className="total-item"
                  style={{
                    paddingBottom: "20px",
                  }}
                >
                  <strong>
                    <button
                      className="Proceed-to-pay-button"
                      onClick={handleProceedToPayClick}
                      style={{
                        borderRadius: "30px",
                        width: "370px",
                      }}
                    >
                      Proceed to pay
                    </button>
                  </strong>
                </div>
                <SearchResults
                  productName={cart.length > 0 ? cart[0].productName : ""}
                  isVisibleDefault={true}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2>Your GOW Cart is empty.</h2>
          <p>
            Check your Saved for later items below or{" "}
            <a href="/">continue shopping.</a>
          </p>
        </>
      )}
    </>
  );
};

export default CartPage;
