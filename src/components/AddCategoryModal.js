import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AddCategoryModal = ({ onClose, onSuccess, category }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    // If a category is passed in for editing, populate the fields
    if (category) {
      setCategoryName(category.categoryName);
      setCategoryDescription(category.categoryDescription || "");
    }
  }, [category]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      categoryName,
      categoryDescription,
    };

    try {
      const url = category
        ? `${process.env.REACT_APP_API_URL}category/update/${category._id}`
        : `${process.env.REACT_APP_API_URL}category/add`;
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          `Category ${category ? "updated" : "added"} successfully`
        );
        onSuccess();
        onClose();
      } else {
        toast.error(`Failed to ${category ? "update" : "add"} category`);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="category-popup">
      <div className="category-popup-content" ref={modalRef}>
        <h2>{category ? "Edit Category" : "Add Category"}</h2>
        <form style={{ padding: "5px" }} onSubmit={handleSubmit}>
          <div className="category-form-group">
            <label className="label-container">
              Category Name{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
              :
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="input-field"
                required
              />
            </label>
          </div>
          <div className="category-form-group">
            <label className="label-container">
              Category Description:
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Enter category "
                className="textarea-field"
                required
              />
            </label>
          </div>
          <div className="category-form-group">
            <button type="submit" className="submit-button">
              {category ? "Update" : "Add"} Category
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
