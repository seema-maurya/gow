import React from "react";
import AddMobileProduct from "./AddMobileProduct";
import "./css/AddMobileProduct.css";
import axios from "axios";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const handleAddProduct = async (formData) => {
    console.log("formData", formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}mobile/addProduct`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Product added successfully!");
      } else {
        toast.error("Failed to add product. Please try again.");
      }
    } catch (error) {
      toast.error("Error adding product. Please try again.");
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <AddMobileProduct onAddProduct={handleAddProduct} />
    </div>
  );
};

export default AdminPanel;
