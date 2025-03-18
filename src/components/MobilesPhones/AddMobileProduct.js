import React, { useState } from "react";
import { toast } from "react-toastify";

const AddMobileProduct = ({ onAddProduct }) => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    color: "",
    price: "",
    mrpPrice: "",
    quantity: "",
    ram: "",
    rom: "",
    battery: "",
    description: "",
    image: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      image: event.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = new FormData();
    for (const key in productDetails) {
      if (productDetails[key] !== null && productDetails[key] !== "") {
        formData.append(key, productDetails[key]);
      }
    }
    if (productDetails.image) {
      formData.append("image", productDetails.image);
    }

    // Log FormData keys and values
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await onAddProduct(formData);

      if (response.status >= 200 && response.status < 300) {
        toast.success("Product added successfully!");
        setProductDetails({
          name: "",
          color: "",
          price: "",
          mrpPrice: "",
          quantity: "",
          ram: "",
          rom: "",
          battery: "",
          description: "",
          image: null,
        });
      } else {
        toast.error("Failed to add product. Please try again.");
      }
    } catch (error) {
      toast.error("Error adding product. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-mobile-product-form">
      <h2>Add New Mobile Product</h2>
      {/* Form Fields */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={productDetails.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          value={productDetails.color}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={productDetails.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="mrpPrice">MRP Price</label>
        <input
          type="number"
          id="mrpPrice"
          name="mrpPrice"
          value={productDetails.mrpPrice}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={productDetails.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ram">RAM (GB)</label>
        <input
          type="number"
          id="ram"
          name="ram"
          value={productDetails.ram}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="rom">ROM (GB)</label>
        <input
          type="number"
          id="rom"
          name="rom"
          value={productDetails.rom}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="battery">Battery (mAH)</label>
        <input
          type="number"
          id="battery"
          name="battery"
          value={productDetails.battery}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={productDetails.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddMobileProduct;
