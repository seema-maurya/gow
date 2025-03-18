import React, { useState, useEffect } from "react";
import {
  FaMinus,
  FaPlus,
  FaUser,
  FaUserShield,
  FaInfoCircle,
} from "react-icons/fa";
// import axios from "axios";
import "../css/home.css";
import logo from "../icons/gw.jpg";
import { Link } from "react-router-dom";
import {
  calculateTotal,
  fetchAllCart,
  handleVariantAddToCart,
  handleRemoveFromCart2Variant,
  handleRemoveFromCartVariant,
} from "./cartFunctions.js";

import Search from "./Search";
import { toast } from "react-toastify";

const Header = () => {
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSizes, setSelectedSizeVariants] = useState("");
  // const [userId, setUserId] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchAllCart(setCart, setSelectedSizeVariants);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchUserProfile(storedUserId);
    } else {
      const storedCart = JSON.parse(localStorage.getItem("carts")) || [];
      setCart(storedCart);
      setSelectedProduct(null);
    }
  }, []);
  console.log("Cart", cart, selectedSizes);
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}user/profile/${userId}`
      );
      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.isAdmin);
        // setUserId(userData._id);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const logout = async () => {
    try {
      // Retrieve user information from localStorage
      const userId = localStorage.getItem("userId");

      if (userId) {
        if (window.gapi && window.gapi.auth2) {
          const auth2 = window.gapi.auth2.getAuthInstance();
          if (auth2) {
            console.log("Signing out using legacy GAPI...");
            auth2
              .signOut()
              .then(() => {
                console.log("User signed out from Google using gapi.auth2");
              })
              .catch((error) => {
                console.error("Error during GAPI signOut:", error);
              });
          }
        }

        // Server logout logic
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}user/logout/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error logging out from the server:", errorData);
          toast.error(errorData.message || "Server logout failed.");
          return;
        }

        // Clear local storage and navigate to login
        console.log("Logging out from server and clearing local storage...");
        localStorage.clear();
        toast.success("You have been logged out successfully.");
        window.location.href = "/login"; // Redirect to the login page
      } else {
        console.error(
          "User is not logged in (userId missing in localStorage)."
        );
      }
    } catch (error) {
      console.error("Error during Google logout:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  useEffect(() => {
    const loadGoogleAPI = () => {
      // Initialize the Google Identity Services API
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
        }
      );

      // Optional: Automatically prompt for sign-in if applicable
      window.google.accounts.id.prompt();
    };

    // Check if the window object has the required gsi client
    if (window.google && window.google.accounts && window.google.accounts.id) {
      loadGoogleAPI();
    } else {
      // Load the GIS script if not already loaded
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleAPI;
      document.body.appendChild(script);
    }
  }, []);

  const addToCartVariant = async (
    product,
    selectedColor,
    selectedSizeVariants,
    cartVariantQuantity,
    variantPrice,
    variantMrpPrice,
    selectedVariant
  ) => {
    // const selectedVariant = getVariantDetails();
    if (!product.selectedSizes && product.selectedColor) {
      alert("Please select a valid size and color");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await handleVariantAddToCart(
      product,
      cart,
      setCart,
      selectedSizeVariants,
      setSelectedSizeVariants,
      selectedColor,
      cartVariantQuantity,
      variantPrice,
      variantMrpPrice
    );
    setIsProcessing(false);
  };

  // Function to handle input blur

  const findCartItem = (productId) => {
    return cart.find((item) => item._id === productId);
  };

  return (
    <div className="" style={{ userSelect: "none" }}>
      <header className="header-area header-padding-1 sticky-bar header-res-padding clearfix">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              <div className="logo" title="" style={{ userSelect: "none" }}>
                <a href="/">
                  <img
                    className="GOW-logo-header"
                    src={logo}
                    alt="My-first-design-2"
                    style={{ width: "120px", height: "auto" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              <div className="main-menu" style={{ backgroundColor: "#e6f6ff" }}>
                <nav>
                  <ul>
                    <li>
                      <a href="/#">
                        <FaUser /> Profile
                        <i className="fa fa-angle-down"></i>
                      </a>
                      <ul className="submenu">
                        {" "}
                        <li>
                          <p>
                            {localStorage.getItem("userEmail") ? (
                              <a onClick={() => logout()} href="##">
                                Logout
                              </a>
                            ) : (
                              <Link to="/login">login / register</Link>
                            )}
                          </p>
                        </li>
                        <li>
                          <a href="/about">about us</a>
                        </li>
                        <li>{/* <a href="/#">cart page</a> */}</li>
                        <li>
                          <Link to="/cart-page">checkout</Link>
                        </li>
                        <li>{/* <a href="/#">wishlist </a> */}</li>
                        {localStorage.getItem("userEmail") ? (
                          <>
                            <li>
                              <Link to="/myAccount">My Account</Link>
                            </li>
                            <li>
                              <Link to="/pdf-download">HistoryInvoice</Link>
                            </li>
                          </>
                        ) : (
                          ""
                        )}
                      </ul>
                    </li>
                    <li>
                      <Search />
                    </li>
                    {isAdmin ? (
                      <li>
                        <a href="/#">
                          <FaUserShield /> Vendor{" "}
                          <i className="fa fa-angle-down"></i>
                        </a>
                        <ul className="submenu">
                          <li>
                            <a href="/add-brand">Add Brand</a>
                          </li>
                          <li>
                            <a href="/product-list">Product List</a>
                          </li>
                          <li>
                            <a href="/feedback-list">Feedback List</a>
                          </li>
                          <li>
                            <a href="/payment-info">User Payment Details</a>
                          </li>
                          <li>
                            <a href="/order-list">Order Details</a>
                          </li>
                          <li>
                            <a href="/login-record ">Login Record</a>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )}
                    <li>
                      <a href="/about">
                        <FaInfoCircle /> About Us
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              <div className="header-right-wrap">
                <div className="header-search-small-display">
                  <Search />
                </div>
                {localStorage.getItem("userEmail") ? (
                  <div className="same-style account-satting">
                    <a className="account-satting-active" href="/#">
                      <i className="pe-7s-user-female"></i>
                    </a>
                    <div className="account-dropdown">
                      <ul>
                        <li>
                          <p>
                            {localStorage.getItem("userEmail") ? (
                              <a onClick={() => logout()} href="/login">
                                Logout
                              </a>
                            ) : (
                              <Link to="/login">Login</Link>
                            )}
                          </p>
                        </li>

                        <li>
                          <a href="/sign-up">Register</a>
                        </li>
                        <li>
                          <a href="/#">Wishlist </a>
                        </li>
                        <li>
                          <Link to="/myAccount">My Account</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="same-style account-satting">
                    <a className="account-satting-active" href="/#">
                      <i className="pe-7s-user-female"></i>
                    </a>
                    <div className="account-dropdown">
                      <ul>
                        <li>
                          <a href="/login">Login</a>
                        </li>
                        <li>
                          <a href="/sign-up">Register</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {selectedProduct && (
                  <div className="same-style header-wishlist">
                    <a href="/#">
                      <i className="pe-7s-like"></i>
                      <p>{selectedProduct.productName}</p>
                    </a>
                  </div>
                )}
                {/* 888888888888 CART LIST 888888888888888888888888888 */}
                <div className="same-style mega-menu cart-wrap">
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

                  <button className="icon-cart"> 

                    {/* <i
                      className="bi-basket" // Bootstrap bucket-style cart icon
                      onClick={() => (window.location.href = `/cart-page`)}
                    ></i> */}
                    <span onClick={() => (window.location.href = `/cart-page`)}>  🛒 </span>

                    <span className="count-style">{cart && cart.length}</span>
                  </button>
                  <div
                    className="shopping-cart-content"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <ul>
                      {cart && cart.length > 0 ? (
                        cart.map((item, index) => {
                          const cartItem = findCartItem(item._id);
                          const isProductInCart = !!cartItem;
                          const isCartQuantityMaxedVariant =
                            isProductInCart &&
                            item.variantQuantity >= item.variant.quantity;
                          const matchingImage =
                            item?.productImages &&
                            item?.productImages
                              ?.filter(
                                (image) =>
                                  image.color.toLowerCase() ===
                                  item.selectedColor.toLowerCase()
                              )
                              .find(
                                (image) =>
                                  image?.filePath &&
                                  !image?.filePath?.startsWith("data:video/")
                              );

                          return (
                            <li className="single-shopping-cart" key={index}>
                              <div className="shopping-cart-img">
                                <div className="shopping-cart-delete">
                                  <button
                                    style={{ top: "" }}
                                    onClick={() =>
                                      handleRemoveFromCartVariant(
                                        index,
                                        cart,
                                        setCart,
                                        item._id
                                      )
                                    }
                                  >
                                    <i className="fa fa-times-circle"></i>
                                  </button>
                                </div>
                                <a href="/#">
                                  {matchingImage ? (
                                    <img
                                      style={{ width: "100px" }}
                                      alt={item.productName}
                                      src={matchingImage.filePath} // Display the matching image
                                      className="cart-image"
                                      onClick={() =>
                                        (window.location.href = `/product?id=${item._id}&color=${item.selectedColor}&size=${item.selectedSizes}`)
                                      }
                                    />
                                  ) : (
                                    <p>
                                      No image available for the selected color.
                                    </p>
                                  )}
                                </a>
                              </div>
                              <div className="quantity-controls">
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
                                      setSelectedSizeVariants,
                                      item.selectedColor,
                                      setIsProcessing
                                    )
                                  }
                                />

                                <div
                                  className="quantity-display"
                                  style={{
                                    userSelect: "none",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {item.variantQuantity}
                                </div>
                                <FaPlus
                                  className="quantity-button plus"
                                  onClick={() =>
                                    !isCartQuantityMaxedVariant &&
                                    addToCartVariant(
                                      item,
                                      item.selectedColor,
                                      item.selectedSizes,
                                      item.variant.quantity,
                                      item.variantPrice,
                                      item.variantMrpPrice,
                                      item.variant
                                    )
                                  }
                                  style={{
                                    cursor: isCartQuantityMaxedVariant
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: isCartQuantityMaxedVariant
                                      ? 0.5
                                      : 1,
                                  }}
                                  title={
                                    isCartQuantityMaxedVariant
                                      ? `This seller has only ${item.variant.quantity} of these available. To see if more are available from another seller, go to the product detail page.`
                                      : "Add to Cart"
                                  }
                                />
                              </div>

                              <div className="shopping-cart-title">
                                <div>
                                  <p>
                                    <strong>Size : </strong>
                                    {item.selectedSizes}
                                  </p>
                                  <a
                                    href={`/product?id=${item._id}`}
                                    key={index}
                                  >
                                    <span style={{ marginRight: "5px" }}></span>
                                    {item.productName}({item.selectedColor}_
                                    {item.selectedSizes})
                                  </a>
                                </div>
                                <h6>
                                  Available Stock :
                                  {item.variant?.quantity -
                                    item.variantQuantity}
                                </h6>
                                <span>&#8377; : {item.variantPrice} /pcs</span>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <h3>Cart is Empty</h3>
                      )}
                    </ul>
                    {/* *******CART TOTAL *********** */}
                    <div className="shopping-cart-total">
                      <h4>
                        SubTotal:
                        <span className="shop-total">
                          &#8377;{calculateTotal(cart)}
                        </span>
                      </h4>
                      <h4>
                        Tax (12%):
                        <span className="shop-total">
                          &#8377;{(calculateTotal(cart) * 0.12).toFixed(2)}
                        </span>
                      </h4>
                      <h4>
                        Final Amount to Pay:
                        <span>
                          &#8377;{(calculateTotal(cart) * 1.12).toFixed(2)}
                        </span>
                      </h4>
                    </div>
                    <div className="shopping-cart-btn btn-hover text-center">
                      <Link to="/cart-page" className="default-btn">
                        view cart
                      </Link>
                      {/* <button className="default-btn">Checkout</button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 77777777777777777777 */}
          </div>
          <div className="mobile-menu-area">
            <div className="mobile-menu" style={{ marginTop: "-" }}>
              <nav id="mobile-menu-active">
                <ul className="menu-overflow">
                  {/* {localStorage.getItem("isAdmin") === "true" ? ( */}
                  {isAdmin ? (
                    <li>
                      <a href="/#">
                        Vendor <i className=""></i>
                      </a>
                      <ul className="submenu">
                        <li>
                          <a href="/add-brand">Add Brand</a>
                        </li>
                        <li>
                          <a href="/CategoryList">CategoryList</a>
                        </li>
                        <li>
                          <a href="/product-list">Product List</a>
                        </li>
                        <li>
                          <a href="/feedback-list">Feedback List</a>
                        </li>
                        <li>
                          <a href="/payment-info">User Payment Details</a>
                        </li>
                        <li>
                          <a href="/order-list">Order Details</a>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <></>
                  )}
                  <li>
                    <a href="/home">HOME</a>
                    <ul>
                      <li>
                        <a href="/#">Collection</a>
                        <ul>
                          <li>
                            <a href="/#">Tops</a>
                          </li>
                          <li>
                            <a href="/#">Bottoms</a>
                          </li>
                          <li>
                            <a href="/#">Dresses</a>
                          </li>
                          <li>
                            <a href="/#">ActiveWear</a>
                          </li>
                          <li>
                            <a href="/#">OuterWear</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="/#">Shop</a>
                    <ul>
                      <li>
                        <a href="/#">Clothing Company</a>
                        <ul>
                          <li>
                            <a href="https://www.nike.com/in ">Nike</a>
                          </li>
                          <li>
                            <a href=" https://www.adidas.co.in/">ADIDAS</a>
                          </li>
                          <li>
                            <a href="www.allensolly.com">ALLENSOLLY</a>
                          </li>
                          <li>
                            <a href="https://www2.hm.com/en_in/index.html">
                              H&M
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="/#">Pages</a>
                    <ul>
                      <li>
                        <a href="/about">about us</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
