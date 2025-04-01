import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaHome, FaEdit } from "react-icons/fa";
import Pagination from "./Pagination/Pagination";

const Subcategories = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [subcategories, setSubcategories] = useState([]); // New state for subcategories
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [editMode, setEditMode] = useState(false); // State to determine if in edit mode
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // State to hold the subcategory being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const modalRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal(); // Close the modal if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCategoryOptions = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "category/allCategory"
      );
      if (response.ok) {
        const data = await response.json();
        const categoryNames = data.map((category) => category.categoryName);
        setCategoryOptions(categoryNames);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch category options");
      }
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "subcategory/allSubCategory" // Adjust endpoint as needed
      );
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error("Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    const data = {
      categoryName: selectedCategory,
      subCategoryName,
      subCategoryDescription,
    };
    if (!selectedCategory) {
      return;
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          (editMode
            ? `subcategory/update/${selectedSubcategory._id}`
            : "subcategory/add"),
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success(
          editMode
            ? "Subcategory updated successfully"
            : "Subcategory added successfully"
        );
        fetchSubcategories(); // Refresh subcategories after add/update
        handleCloseModal(); // Close modal after action
      } else {
        toast.error("Failed to add/update subcategory");
      }
    } catch (error) {
      toast.error("Error during subcategory operation:", error);
    }
  };

  const handleOpenModal = (subcategory = null) => {
    if (subcategory) {
      setSelectedSubcategory(subcategory);
      setSelectedCategory(subcategory.categoryName); // Set the category to the subcategory's category
      setSubCategoryName(subcategory.subCategoryName);
      setSubCategoryDescription(subcategory.subCategoryDescription);
      setEditMode(true);
    } else {
      setEditMode(false);
      setSelectedCategory("");
      setSubCategoryName("");
      setSubCategoryDescription("");
    }
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedSubcategory(null);
    setSelectedCategory(""); // Reset selected category
    setSubCategoryName("");
    setSubCategoryDescription("");
  };

  useEffect(() => {
    fetchCategoryOptions();
    fetchSubcategories();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subcategories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <div>
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
            <h1 className="h1">Subcategories</h1>
            <h1 className="h1">
              <button
                onClick={() => handleOpenModal()}
                className="add-category-button"
              >
                Add Subcategory
              </button>
            </h1>
          </div>

          {/* Modal for adding/editing subcategory */}
          {modalIsOpen && (
            <div className="category-popup">
              <div className="category-popup-content" ref={modalRef}>
                <h2>{editMode ? "Edit Subcategory" : "Add Subcategory"}</h2>
                <form
                  style={{ padding: "5px" }}
                  onSubmit={handleAddSubCategory}
                >
                  <label>
                    Category:
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        !editMode && setSelectedCategory(e.target.value)
                      }
                      disabled={editMode} // Disable dropdown in edit mode
                      required={"select the selected category"}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((categoryName) => (
                        <option key={categoryName} value={categoryName}>
                          {categoryName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <br />
                  <label>
                    SubCategory Name<span style={{ color: "red" }}>*</span>:
                    <input
                      type="text"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      placeholder="Enter subcategory name"
                      required
                    />
                  </label>
                  <div>
                    <label>
                      SubCategory Description:
                      <textarea
                        value={subCategoryDescription}
                        onChange={(e) =>
                          setSubCategoryDescription(e.target.value)
                        }
                        placeholder="Enter subcategory Description"
                        required
                      />
                    </label>
                  </div>
                  <button style={{ marginBottom: "2px" }} a type="submit">
                    {editMode ? "Update" : "Add"}
                  </button>
                  <button type="button" onClick={handleCloseModal}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Subcategories table */}
          <div className="subcategories-table-container">
            <table className="subcategories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Subcategory Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((subcategory) => (
                  <tr key={subcategory._id}>
                    <td>{subcategory.categoryName}</td>
                    <td>{subcategory.subCategoryName}</td>
                    <td>
                      {subcategory.subCategoryDescription ||
                        "No description available"}
                    </td>
                    <td>
                      <FaEdit
                        onClick={() => handleOpenModal(subcategory)}
                        className="edit-button"
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
            filteredPaymentInfo={subcategories}
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

export default Subcategories;
