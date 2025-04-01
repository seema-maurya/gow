import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Proceedtopay.css";
import {
  FaUserLock,
  FaUserPlus,
  FaHome,
  FaLock,
  FaEnvelope,
  FaEyeSlash,
  FaEye,
  FaExclamationCircle,
} from "react-icons/fa";
// import tyreLogo from "../icons/tyrelogo.jpg";
import { toast } from "react-toastify";
import "../css/login.css";
// import logo from "../icons/maurya.png";
import GoogleSingup from "./GoogleSingup";
// import { AuthContext } from "./AuthContext"; // Adjust the path
// import axios from "axios";

const Login = () => {
  // const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [step, setStep] = useState(1); // Step 1 for entering email, Step 2 for entering OTP and new password
  const [isLoading, setIsLoading] = useState(false);
  const [otpValidity, setOtpValidity] = useState(0); // Time remaining for OTP validity in seconds
  const [timerInterval, setTimerInterval] = useState(null); // Interval reference for updating the timer
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("userId");
    if (isLoggedIn) {
      setRedirectToHome(true);
    }
    // Clear timer interval on component unmount to prevent memory leaks
    return () => {
      clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to start the OTP validity countdown timer
  const startOTPTimer = () => {
    const interval = setInterval(() => {
      setOtpValidity((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(interval); // Clear timer interval when OTP expires
          return 0;
        }
      });
    }, 1000); // Update timer every second
    setTimerInterval(interval);
  };

  const handleSendOTP = async () => {
    if (!email) {
      toast.warning("Please enter your email address");
      setTimeout(() => {
        toast.dismiss(); // Dismiss the toast after 0.2 seconds
      }, 2000);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setStep(2);
        setOtpValidity(60); // Set OTP validity to 60 seconds
        startOTPTimer(); // Start OTP validity countdown timer
        toast.success("OTP sent successfully");
      } else {
        const errorMessage = await response.json();
        toast.error(errorMessage.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@])[0-9a-zA-Z@]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.warning(
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character '@'."
      );
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );
      console.log("RESponse", response);
      if (response.ok) {
        toast.success("Password reset successful", 2000);
        setStep(1);
        setEmail("");
        setOtp(""); // Clear OTP from state
        setNewPassword(""); // Clear new password from state
        setTimerInterval(null);
        setOtpValidity(0);
        setResetPasswordSuccess(true); // Set resetPasswordSuccess to true
      } else {
        const errorMessage = await response.json();
        toast.error(errorMessage.message);
      }
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = () => {
    setShowForgotPasswordForm(true);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setResetPasswordSuccess(false);
  };

  const logins = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const loginData = await response.json();
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsProcessing(false);

      console.log(loginData, response);

      if (response.ok) {
        console.log("User LOGIN successfully");
        // login(loginData);
        // const redirectUrl = localStorage.getItem("redirectAfterLogin");

        // if (redirectUrl) {
        //   window.location.href = redirectUrl;
        //   localStorage.removeItem("redirectAfterLogin");
        // } else {
        // }
        // Navigate("/");

        // const data = await response.json();
        // const redirectUrl = data.redirectUrl || "/";
        // window.location.href = redirectUrl;

        localStorage.setItem("userId", loginData._id);
        console.log("USERID", loginData._id, loginData.firstName);
        localStorage.setItem("phoneNumber", loginData.phoneNumber);
        localStorage.setItem("firstName", loginData.firstName);
        localStorage.setItem("lastName", loginData.lastName);
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("isAdmin", loginData.isAdmin);
        localStorage.setItem("userName", loginData.userName);

        toast.success("Logged in successfully", 200);
        window.location = "/";
      } else {
        if (!loginData.success && response.status === 403) {
          toast.warning(loginData.message);
        } else {
          toast.warning("Incorrect Credentials");
          console.error("Failed to LOGIN user");
        }
      }
    } catch (error) {
      toast.warning("Something went wrong or Server side Error");
      console.error("Error during user LOGIN:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (resetPasswordSuccess) {
      timer = setTimeout(() => {
        setShowForgotPasswordForm(false);
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup on unmount or when resetPasswordSuccess changes
  }, [resetPasswordSuccess]);

  const renderForgotPasswordForm = () => {
    if (resetPasswordSuccess) {
      return (
        <div>
          <p>Password reset successfully!</p>
        </div>
      );
    }

    return (
      <div>
        <h3>Forgot Password</h3>
        <p>
          Please enter your email address to receive a one-time password (OTP)
          for password reset.
        </p>
        {step === 1 && (
          <div>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSendOTP}
              disabled={isLoading || otpValidity > 0}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
            {/* Display timer for OTP validity */}
            {otpValidity > 0 && <p>OTP expires in {otpValidity} seconds</p>}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Reset Password</h3>
            <div className="mb-3">
              <label>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetPassword}
              disabled={isLoading || otpValidity === 0}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
            {/* Button to resend OTP */}
            <button
              type="button"
              className=" btn-secondary"
              onClick={handleSendOTP}
              disabled={isLoading || otpValidity > 0}
              style={{
                backgroundColor: otpValidity > 0 ? "#d1d9e1" : "",
              }}
            >
              Resend OTP
            </button>
            {otpValidity > 0 && (
              <p style={{ fontSize: "11px" }}>
                <FaExclamationCircle /> Please wait {otpValidity} seconds before
                requesting another code.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (redirectToHome) {
    setTimeout(() => {
      // Navigate("/login");
      window.location = process.env.REACT_APP_API_URL_FOR_GUI;
      window.location = "/";
    }, 10); // 3000 milliseconds = 3 seconds

    return (
      // <div>
      //   <img
      //     src="https://i.ibb.co/M23HzTF/9-Qgzvh-Logo-Makr.png"
      //     alt="Redirecting..."
      //   />
      // </div>
      <div
        className="logo-container"
        style={{ userSelect: "none", textDecoration: "none" }}
      >
        <a href="/" className="gow-logo">
          <span className="gow-main">GOW</span>
          <br />
          <span className="gow-full">Galaxy of Wishes</span>
        </a>
      </div>
    );
  }

  return (
    <form className="forms">
      {isProcessing && (
        <div className="overlay">
          <div className="processing-modal">
            <div className="spinner"></div>
            <p>
              <span className="processing">
                {/* <img src={logo} alt="Logo" /> */}
                <div
                  className="logo-container"
                  style={{ userSelect: "none", textDecoration: "none" }}
                >
                  <a href="/" className="gow-logo">
                    <span className="gow-main">GOW</span>
                    <br />
                    <span className="gow-full">Galaxy of Wishes</span>
                  </a>
                </div>
                s
              </span>
              {/* <div className="processing">Processing</div>{" "}
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span> */}
            </p>
          </div>
        </div>
      )}
      {/* <a href="/">
        <img
          height={100}
          width={100}
          src={logo}
          alt="Tyre Logo"
          className="tyre-logo"
        />
      </a> */}
      <div
        className="logo-container"
        style={{ userSelect: "none", textDecoration: "none" }}
      >
        <a href="/" className="gow-logo">
          <span className="gow-main">GOW</span>
          <span className="gow-full">Galaxy of Wishes</span>
        </a>
      </div>
      <h3>
        <FaUserLock style={{ marginRight: "5px" }} />
        Login In
      </h3>
      <div className="mb-3">
        <label>
          <FaEnvelope style={{ marginRight: "5px" }} />
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          name="email" // Added name attribute
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>
          <FaLock style={{ marginRight: "5px" }} />
          Password
        </label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Enter password"
            name="password" // Added name attribute
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" onClick={logins}>
            Login
          </button>
        </div>
      </div>
      {showForgotPasswordForm ? (
        renderForgotPasswordForm()
      ) : (
        <p className="forgot-password text-right">
          <a href="##" onClick={handleForgotPassword}>
            <FaLock /> Forgot password?
          </a>
        </p>
      )}

      <p className="forgot-password text-right">
        <FaUserPlus style={{ marginRight: "5px" }} />
        New User : <Link to="/sign-up">signup</Link>
      </p>
      <GoogleSingup />

      <p className="forgot-password text-right">
        <FaHome style={{ marginRight: "5px" }} />
        <a href="/">Home</a>
      </p>
    </form>
  );
};

export default Login;
