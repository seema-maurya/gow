import React, { useState, useEffect } from "react";
import "../css/categories.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaHome } from "react-icons/fa";
import AddCategoryModal from "./AddCategoryModal";
import Pagination from "./Pagination/Pagination";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryToEdit, setCategoryToEdit] = useState(null); // New state to hold category being edited
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "category/allCategory"
      );
      console.log("RESPONSE", response);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Error fetching categories: " + error.message);
    }
  };

  const handleOpenModal = (category = null) => {
    setCategoryToEdit(category); // If editing, set the category to edit
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCategoryToEdit(null); // Reset after closing modal
  };

  const handleAddOrEditCategorySuccess = () => {
    fetchCategories(); // Refresh the category list after adding/editing
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="categories-container">
      {isLoading ? (
        <div className="skeleton-loader">
          <div className="skeleton-heading"></div>
          <div className="skeleton-table">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-row">
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
              padding: "0px 0",
            }}
          >
            <h1 className="h1">Categories</h1>
            <h1 className="h1">
              <button
                onClick={() => handleOpenModal()}
                className="add-category-button"
              >
                Add Category
              </button>
            </h1>
          </div>
          {modalIsOpen && (
            <AddCategoryModal
              onClose={handleCloseModal}
              onSuccess={handleAddOrEditCategorySuccess}
              category={categoryToEdit} // Pass category to edit
            />
          )}

          {/* Categories table */}
          <div className="categories-table-container">
            {currentItems.length > 0 ? (
              <table className="categories-table">
                <thead>
                  <tr>
                    <th> Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((category, index) => (
                    <tr key={index}>
                      <td>{category.categoryName}</td>
                      <td>
                        {category.categoryDescription ||
                          "No description available"}
                      </td>
                      <td>
                        <FaEdit
                          onClick={() => handleOpenModal(category)}
                          className="edit-category-button"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No categories available.</p>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredPaymentInfo={categories}
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
    </div>
  );
};

export default Categories;
