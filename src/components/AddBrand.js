import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../css/AddBrand.css";
import Subcategories from "./subcategories";
import Categories from "./Categories.js";

import AddProduct from "./AddProduct";
import { FaHome, FaEdit } from "react-icons/fa";
import Pagination from "./Pagination/Pagination";

const AddBrand = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null); // State to store brand ID for editing
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [activeTab, setActiveTab] = useState("Categories"); // Default to Categories tab
  const [isAdmin, setIsAdmin] = useState(false);
  const [brands, setBrands] = useState([]); // State to hold list of brands
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const modalRef = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isAdminStored = localStorage.getItem("isAdmin");
    setIsAdmin(isAdminStored === "true");
    fetchCategoryOptions();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "brand/allBrand"
      );
      setBrands(response.data); // Populate the brands state with fetched brands
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Error fetching brands");
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "category/allCategory"
      );
      const categoryOptions = response.data.map(
        (category) => category.categoryName
      );
      setCategoryOptions(categoryOptions);
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  const fetchSubCategoryOptions = async (selectedCategory) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `subcategory/getSubcategoriesByCategoryName/${selectedCategory}`
      );
      const subCategoryOptions = response.data.map(
        (subcategory) => subcategory.subCategoryName
      );
      setSubCategoryOptions(subCategoryOptions);
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
    }
  };

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    fetchSubCategoryOptions(selectedCategory); // Fetch subcategories based on selected category
  };

  const handleAddOrUpdateBrand = async (e) => {
    e.preventDefault();
    try {
      const brandData = {
        categoryName: selectedCategory,
        subCategoryName: selectedSubCategory,
        clothingCompanyName: productName,
        clothingCompanyDescription: productDescription,
      };

      if (editMode) {
        // Update existing brand
        const response = await axios.put(
          process.env.REACT_APP_API_URL + `brand/update/${editingBrandId}`,
          brandData
        );
        if (response.status === 200) {
          toast.success("Brand updated successfully");
        } else {
          toast.error("Failed to update brand");
        }
      } else {
        // Add new brand
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "brand/add",
          brandData
        );

        if (response.status === 201) {
          toast.success("Brand added successfully");
        } else if (response.status === 406) {
          toast.warning("Duplicate Data");
        } else {
          toast.error("Failed to add brand");
        }
      }

      // Reset the form and fetch updated brands
      handleCloseModal(); // Close modal after action
      fetchBrands();
    } catch (error) {
      console.error("Error adding/updating brand:", error);
      toast.error("Error adding/updating brand");
    }
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedCategory(""); // Reset selected category
    setSelectedSubCategory("");
    setProductName("");
    setProductDescription("");
    setEditMode(false);
    setEditingBrandId(null); // Store the brand ID
  };

  // const handleDeleteBrand = async (brandId) => {
  //   try {
  //     const response = await axios.delete(
  //       process.env.REACT_APP_API_URL + `brand/delete/${brandId}`
  //     );
  //     if (response.status === 200) {
  //       toast.success("Brand deleted successfully");
  //       fetchBrands(); // Refresh the list after deletion
  //     } else {
  //       toast.error("Failed to delete brand");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting brand:", error);
  //     toast.error("Error deleting brand");
  //   }
  // };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleOpenModal = async (brand = null) => {
    if (brand) {
      setSelectedCategory(brand.categoryName); // Set the category to the subcategory's category
      await fetchSubCategoryOptions(brand.categoryName);
      setSelectedSubCategory(brand.subCategoryName);
      setProductName(brand.clothingCompanyName);
      setProductDescription(brand.clothingCompanyDescription);
      setEditMode(true);
      setEditingBrandId(brand._id); // Store the brand ID
    } else {
      setSelectedCategory(""); // Set the category to the subcategory's category
      setSelectedSubCategory("");
      setProductName("");
      setProductDescription("");
      setEditMode(false);
      setEditingBrandId(null); // Store the brand ID
    }
    setModalIsOpen(true);
  };

  const isProductNameEmpty = productName.trim() === "";
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = brands?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  return (
    <>
      {isAdmin ? (
        <div className="add-product-container">
          <div className="tab-buttons">
            <button
              className={activeTab === "Categories" ? "active" : ""}
              onClick={() => setActiveTab("Categories")}
            >
              ADD CATEGORY
            </button>
            <button
              className={activeTab === "SUBCATEGORY" ? "active" : ""}
              onClick={() => setActiveTab("SUBCATEGORY")}
            >
              ADD SUBCATEGORY
            </button>
            <button
              className={activeTab === "ADD-BRAND" ? "active" : ""}
              onClick={() => setActiveTab("ADD-BRAND")}
            >
              ADD BRAND
            </button>
            <button
              className={activeTab === "ADD-PRODUCT" ? "active" : ""}
              onClick={() => setActiveTab("ADD-PRODUCT")}
            >
              ADD PRODUCT
            </button>
          </div>

          <div className="tab-content-brand">
            {activeTab === "ADD-PRODUCT" && (
              <div>
                <AddProduct />
              </div>
            )}

            {activeTab === "Categories" && (
              <div>
                <Categories />
              </div>
            )}
            {activeTab === "SUBCATEGORY" && (
              <div>
                <Subcategories />
              </div>
            )}
            {activeTab === "ADD-BRAND" && (
              <>
                <div className="categories-container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      // alignItems: "center",
                      padding: "0px 0",
                    }}
                  >
                    <h1 className="h1">Brand</h1>
                    <h1 className="h1">
                      <button
                        onClick={() => handleOpenModal()}
                        className="add-category-button"
                      >
                        Add Brand
                      </button>
                    </h1>
                  </div>
                  {modalIsOpen && (
                    <div className="category-popup">
                      <div className="category-popup-content" ref={modalRef}>
                        <h2>{editMode ? "Edit Brand" : "Add Brand"}</h2>
                        <form style={{ padding: "5px" }}>
                          <label>
                            Category:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <select
                              value={selectedCategory}
                              // onChange={handleCategoryChange}
                              onChange={(e) =>
                                !editMode && handleCategoryChange(e)
                              }
                              disabled={editMode}
                              required
                            >
                              <option value="">Select a category</option>
                              {categoryOptions.map((categoryName) => (
                                <option key={categoryName} value={categoryName}>
                                  {categoryName}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Subcategory:&nbsp;&nbsp;
                            <select
                              value={selectedSubCategory}
                              // onChange={(e) =>
                              //   setSelectedSubCategory(e.target.value)
                              // }
                              onChange={(e) =>
                                !editMode &&
                                setSelectedSubCategory(e.target.value)
                              }
                              disabled={editMode}
                              required
                            >
                              <option value="">Select a subcategory</option>
                              {subCategoryOptions.map((subcategoryName) => (
                                <option
                                  key={subcategoryName}
                                  value={subcategoryName}
                                >
                                  {subcategoryName}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            Product Clothing Brand
                            <span style={{ color: "red" }}>*</span>:
                            <input
                              type="text"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              placeholder="Enter Product Brand"
                              required
                            />
                          </label>

                          <label>
                            Clothing Product Description:
                            <textarea
                              value={productDescription}
                              onChange={(e) =>
                                setProductDescription(e.target.value)
                              }
                              placeholder="Enter product description"
                              required
                            />
                          </label>

                          <button
                            onClick={handleAddOrUpdateBrand}
                            disabled={isProductNameEmpty}
                            style={{ marginBottom: "2px" }}
                          >
                            {editMode ? "Update" : "Add"}{" "}
                          </button>
                          <button type="button" onClick={handleCloseModal}>
                            Close
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="subcategories-table-container">
                  <table className="subcategories-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Brand</th>
                        <th>Brand_Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems?.map((brand) => (
                        <tr key={brand._id}>
                          <td>{brand.categoryName}</td>
                          <td>{brand.subCategoryName}</td>
                          <td>{brand.clothingCompanyName}</td>
                          <td>
                            {brand.clothingCompanyDescription ||
                              "No description available"}
                          </td>
                          <td>
                            <FaEdit
                              onClick={() => handleOpenModal(brand)}
                              className="edit-category-button"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  indexOfFirstItem={indexOfFirstItem}
                  indexOfLastItem={indexOfLastItem}
                  filteredPaymentInfo={brands}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                />

                <p className="home">
                  <Link to="/home">
                    <FaHome />
                    Home
                  </Link>
                </p>
              </>
            )}
            {/* Display the list of brands */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddBrand;
