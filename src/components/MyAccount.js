import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaAddressCard,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
  FaLock,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Switch from "react-switch";

import "../css/MyAccount.css";

const MyAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const firstNameFromStorage = localStorage.getItem("firstName");
    const lastNameFromStorage = localStorage.getItem("lastName");
    // const emailFromStorage = localStorage.getItem("userEmail");

    if (firstNameFromStorage && lastNameFromStorage) {
      // setFirstName(firstNameFromStorage);
      // setLastName(lastNameFromStorage);
      // setEmail(emailFromStorage);
    }

    console.log("fullName :", firstNameFromStorage + " " + lastNameFromStorage);
    console.log("userId :", userIdFromStorage);
    setUserId(userIdFromStorage);
    fetchUserProfile(userIdFromStorage);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilitys = () => {
    setShowPasswords(!showPasswords);
  };

  const fetchUserProfile = async (userId) => {
    if (!userId) {
      console.error("User ID is required");
      toast.error("User ID is required");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `user/profile/${userId}`
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("RES", userData);
        toast.success("User profile");
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setAddress(userData.address);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.email);
        setAge(userData.age);
        setGender(userData.gender);
      } else if (response.status === 404) {
        console.error("User profile not found");
        toast.error("User profile not found");
      } else {
        console.error("Failed to fetch user profile");
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error fetching user profile");
    }
  };

  const handleUpdateProfile = async () => {
    const updatedProfileData = {
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
      age,
      gender,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `user/profile/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfileData),
        }
      );
      console.log("Update", response);
      if (response.ok) {
        localStorage.setItem("phoneNumber", phoneNumber);
        fetchUserProfile(userId);
        toast.success("Profile updated successfully");
      } else {
        console.error("Failed to update user profile");
        toast.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error updating user profile");
    }
  };

  const handleChangePassword = async () => {
    const isOldPasswordValid = true; // Assume the old password is valid

    if (!isOldPasswordValid) {
      toast.error("Old password is incorrect");
      return;
    }

    // Check if new password meets your criteria (e.g., length, complexity, etc.)
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@])[0-9a-zA-Z@]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.warning(
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character '@'."
      );
      return;
    }
    // Check if confirm password matches new password
    if (newPassword !== confirmPassword) {
      toast.error("Confirm password does not match new password");
      return;
    }

    // If all validations pass, send a request to update the password
    try {
      // Send a request to your backend to update the password
      // Replace the following with your actual API endpoint
      const response = await fetch(
        process.env.REACT_APP_API_URL + `user/changePassword/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      console.log(response);
      if (response.ok) {
        // Password changed successfully
        console.log("Success");
        toast.success("Password changed successfully");
      } else {
        // Handle error scenario
        const data = await response.json();
        toast.error(data.message); // Display error message from the backend
      }
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password. Please try again later.");
    }
  };

  const handleChangePhoneNumber = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // Remove any non-digit characters
    if (phoneNumber.length <= 10) {
      setPhoneNumber(phoneNumber);
    }
  };

  const handleChangeAge = (e) => {
    let age = e.target.value.replace(/\D/g, ""); // Remove any non-digit characters
    age = age.replace(/^0+/, ""); // Remove leading zeros

    // If age is empty or zero after removing leading zeros, set it to 1
    if (parseInt(age, 10) === 0) {
      age = "1";
    }

    setAge(age);
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };

  return (
    <div>
      <div className="my-account-container">
        <h2>My Account</h2>
        <div className="profile-details">
          <div className="profile-item">
            <FaUser />
            <input
              type="text"
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div className="profile-item">
            <FaAddressCard />
            <input
              type="text"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
          <div className="profile-item">
            <FaPhone />
            <input
              type="text"
              value={phoneNumber || ""}
              onChange={handleChangePhoneNumber}
              placeholder="Phone Number"
            />
            <FaBirthdayCake />
            <input
              type="text"
              value={age || ""}
              onChange={handleChangeAge}
              placeholder="Age"
            />
          </div>
          <div className="profile-item">
            <FaUser />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="profile-item">
            <FaEnvelope />
            <input
              type="email"
              value={email}
              readOnly // Make the email input read-only
              placeholder="Email"
            />
          </div>
          <button className="update-profile-btn" onClick={handleUpdateProfile}>
            Update Profile
          </button>
          <div className="profile-item">
            <label
              className="labelMyAccount"
              style={{ display: "flex", alignItems: "center" }}
            >
              Do you want to change the password?
              <Switch
                checked={changePassword}
                onChange={toggleChangePassword}
              />
            </label>
          </div>
          {changePassword && (
            <div>
              <div style={{ backgroundColor: "#043468" }}>
                <h3 className="change-password">Change Password</h3>
              </div>
              <div className="profile-item">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  // className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                />
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="profile-item">
                <FaLock />
                <input
                  // className="form-control"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  style={{
                    borderColor: newPassword ? "blue" : "red",
                  }}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibilitys}
                >
                  {showPasswords ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="profile-item">
                <FaLock />
                <input
                  // className="form-control"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  style={{
                    boxShadow: newPassword ? "" : "red",
                  }}
                />
              </div>
              <button
                className="update-profile-btn"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
      <br />
    </div>
  );
};

export default MyAccount;
