import React, { useState, useEffect, useCallback } from "react";
import "../css/signup.css";
import { toast } from "react-toastify";
import logo from "../icons/gow.jpg";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  FaUserLock,
  FaUser,
  FaLock,
  FaEnvelope,
  FaHome,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import GoogleSingup from "./GoogleSingup";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log("ClientID", clientId);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userId");
    if (isLoggedIn) {
      setRedirectToHome(true);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (otpSent && !otpExpired) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown <= 0) {
      clearInterval(interval);
      setOtpExpired(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpExpired, countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "otp") setOtp(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const signUp = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@])[0-9a-zA-Z@]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.info(
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character '@'."
      );
      return;
    }

    try {
      const emailExistsResponse = await fetch(
        process.env.REACT_APP_API_URL + "user/emailExists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const emailExistsData = await emailExistsResponse.json();

      if (emailExistsData.exists) {
        toast.warning("Email already exists... You can login directly.");
        return;
      }

      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      if (response.status === 201) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        toast.warning("Failed to register user");
      }
    } catch (error) {
      toast.warning("Something went wrong");
      console.error("Error during user registration:", error);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsProcessing(false);

      if (response.ok) {
        setEmail("");
        setOtp("");
        toast.success("OTP verified successfully");
        window.location.href = "/login";
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP");
    }
  };

  const redirectToHomePage = useCallback(() => {
    setTimeout(() => {
      window.location = "/";
    }, 10);
  }, []);

  // const handleSuccess = async (credentialResponse) => {
  //   try {
  //     console.log(credentialResponse);
  //     // Validate Google credentialResponse
  //     if (!credentialResponse || !credentialResponse.credential) {
  //       toast.error("Invalid Google response. Please try again.");
  //       return;
  //     }
  //     const googleCredential = credentialResponse.credential;

  //     // Send the token to your backend for verification
  //     const response = await fetch(
  //       process.env.REACT_APP_API_URL + "user/google-signin",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ token: googleCredential }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Error verifying token:", errorData);
  //       toast.error(errorData.message || "Google Sign-In failed.");
  //       return;
  //     }

  //     const userData = await response.json();
  //     // Save user details in localStorage or state (based on your logic)
  //     localStorage.setItem("userId", userData._id);
  //     localStorage.setItem("userEmail", userData.email);
  //     localStorage.setItem("isAdmin", userData.isAdmin);
  //     toast.success("Google Sign-In successful!");
  //     window.location.href = "/home"; // Redirect to the home page
  //   } catch (error) {
  //     console.error("Error during Google Sign-In:", error);
  //     toast.error("An error occurred during Google Sign-In. Please try again.");
  //   }
  // };

  // const handleError = () => {
  //   toast.error(
  //     "Google Sign-In failed. Please check your internet connection or try again."
  //   );
  // };

  useEffect(() => {
    if (redirectToHome) {
      redirectToHomePage();
    }
  }, [redirectToHome, redirectToHomePage]);

  if (redirectToHome) {
    return (
      <div>
        <img
          src="https://i.ibb.co/M23HzTF/9-Qgzvh-Logo-Makr.png"
          alt="Redirecting..."
        />
      </div>
    );
  }

  if (otpSent && !otpExpired) {
    return (
      <div>
        {isProcessing && (
          <div className="overlay">
            <div className="processing-modal">
              <div className="spinner"></div>
              <p>
                <div className="processing">Processing</div>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </p>
            </div>
          </div>
        )}
        <h2>Enter OTP</h2>
        <form onSubmit={verifyOTP}>
          <div className="form-group">
            <p>Time left to verify OTP: {countdown} seconds</p>
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Verify OTP
          </button>
        </form>
      </div>
    );
  }

  if (otpExpired) {
    setOtpSent(false);
    window.location.href = "/sign-up";
    return (
      <div>
        <h2>OTP Expired</h2>
        <p>The OTP has expired. Please sign up again.</p>
      </div>
    );
  }

  return (
    <form className="forms">
      <a href="/">
        <img
          height={100}
          width={100}
          src={logo}
          alt="Tyre Logo"
          className="tyre-logo"
        />
      </a>
      <h3>
        <FaUserLock style={{ marginRight: "5px" }} />
        Sign Up
      </h3>

      <div className="mb-3">
        <label>
          <FaUser style={{ marginRight: "5px" }} />
          First name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>
          <FaUser style={{ marginRight: "5px" }} />
          Last name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>
          <FaEnvelope style={{ marginRight: "5px" }} />
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="d-grid">
        <button className="btn btn-primary" onClick={signUp}>
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered{" "}
        <a href="/login">
          <FaSignInAlt style={{ marginRight: "5px" }} />
          Login ?
        </a>
      </p>
      <GoogleSingup />
      <p className="forgot-password text-right">
        <a href="/home">
          <FaHome style={{ marginRight: "5px" }} />
          Home
        </a>
      </p>
    </form>
  );
};

export default SignUp;
