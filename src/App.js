import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/signup";
import HomePage from "./components/HomePage";
import About from "./components/about";
import AddBrand from "./components/AddBrand";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";

import Feedback from "./components/Feedback";
import MyAccount from "./components/MyAccount";
import CartPage from "./components/CartPage";
import Header from "./components/Header";
import WelcomeMessage from "./components/WelcomeMessage";
import MainPopup from "./components/MainPopup";
import PaymentInfo from "./components/PaymentInfo";
import OrderList from "./components/OrderList";
import PdfDownload from "./components/PdfDownload";
import LoginRecords from "./components/LoginRecords";
import ProceedToPay from "./components/ProceedToPay";
import InvoicePage from "./components/InvoicePage";
import ProductDetail from "./components/ProductDetail"; // Your product detail page component
import SearchResults from "./components/SearchResults.js";
import AdminPanel from "./components/MobilesPhones/AdminPanel.js";
import ReviewList from "./components/RatingProduct/ReviewList.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import the styles
import ChatBox from "./components/ChatBox.js";

import ProductDetailID from "./components/ProductDetailID.js";
import { CartProvider } from "./components/CartContext.js";
// import { AuthProvider } from "./components/AuthContext.js";
// ToastContainer for global toast options

const Home = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const location = useLocation(); // Get the current route

  const handleCloseWelcomeMessage = () => {
    setShowWelcomeMessage(false);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const userEmail = localStorage.getItem("userEmail");

    setIsAdmin(isAdmin);
    setUserEmail(userEmail);
  }, []);

  const { history } = props;

  return (
    <CartProvider>
      <div className="app">
        {showWelcomeMessage && (
          <WelcomeMessage onClose={handleCloseWelcomeMessage} />
        )}
        <div className="navigation">
          {location.pathname !== "/cart-page" &&
            location.pathname !== "/sign-up" &&
            location.pathname !== "/login" && <Header />}{" "}
          {/* Conditionally render Header */}
          <ChatBox />
        </div>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="cart-page" element={<CartPage />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<About />} />
            {isAdmin && (
              <>
                <Route path="add-brand" element={<AddBrand />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="/login-record" element={<LoginRecords />} />
                <Route path="/order-list" element={<OrderList />} />
                <Route path="/review-list" element={<ReviewList />} />
              </>
            )}
            <Route path="proceedToPay" element={<ProceedToPay />} />
            <Route path="invoice-page" element={<InvoicePage />} />
            <Route path="header" element={<Header />} />
            <Route path="/search-results" element={<SearchResults />} />

            <Route path="feedback-list" element={<Feedback />} />
            {userEmail ? (
              <Route path="myAccount" element={<MyAccount />} />
            ) : null}

            <Route path="*" element={<Login />} />
            <Route path="MainPopup" element={<MainPopup />} />
            <Route
              path="payment-info"
              element={<PaymentInfo history={history} />}
            />

            <Route path="/pdf-download" element={<PdfDownload />} />

            <Route path="/product" element={<ProductDetail />} />
            <Route path="/product-details-id" element={<ProductDetailID />} />
            {/* Mobile Related all below */}
            <Route path="/admin-Panel-mobile" element={<AdminPanel />} />
          </Routes>
          <ToastContainer
            position="top-right" // Always top-right corner
            autoClose={2000} // Auto close after 3 seconds
            hideProgressBar={true}
            newestOnTop={true} // Show newest on top
            closeOnClick // Close on clicking the toast
            pauseOnFocusLoss // Pause toast on focus loss
            draggable // Allow dragging
            pauseOnHover // Pause toast when hovered
            limit={1} // Only 1 notification at a time
            className="custom-toast-container" // Custom class for additional CSS
            toastClassName="custom-toast" // Custom class for toasts
          />
        </div>
      </div>
    </CartProvider>
  );
};

export default Home;
