import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/ProductList.css";
import { toast } from "react-toastify";
import {
  handleSearchKeyPress,
  handleApprovalToggle,
  fetchUnapprovedReviews,
  handleConfirmDelete,
} from "./VariantReusable.js";
import {
  FaPencilAlt,
  FaImages,
  FaFolder,
  FaTags,
  FaRupeeSign,
  FaCubes,
  FaIndustry,
  FaBook,
  FaEdit,
  FaTrash,
  FaShoppingBag,
  FaMicrophone,
} from "react-icons/fa";
import ProductDeleteConfirmationPopup from "./ProductDeleteConfirmationPopup.js";
import { Link } from "react-router-dom";
import Pagination from "./Pagination/Pagination.js";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    product: null,
  });
  const [isListening, setIsListening] = useState(false);

  const [unapprovedReviews, setUnapprovedReviews] = useState({}); // To track unapproved reviews for each product
  const [showUnapprovedReviews, setShowUnapprovedReviews] = useState(false); // State to control visibility

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPaymentInfo, setFilteredPaymentInfo] = useState([]);
  const [enteredProductName, setEnteredProductName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(adminStatus);
    if (adminStatus) {
      fetchAllProducts();
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (products.length > 0) {
        try {
          console.log("65Admin", isAdmin);
          await fetchUnapprovedReviews(isAdmin, setUnapprovedReviews);
        } catch (error) {
          console.error("Error fetching unapproved reviews:", error);
        }
      }
    };

    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };
  useEffect(() => {
    console.log("Unapproved Reviews State Updated:", unapprovedReviews);
  }, [unapprovedReviews]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const getFilteredVariant = (product) => {
    return product.variants.find(
      (variant) =>
        variant.color === selectedColor &&
        variant?.sizes?.some((sizeObj) => sizeObj.size === selectedSize)
    );
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      handleCancelDelete();
    }
  };

  const handleDelete = (_id, product) => {
    setDeleteConfirmation({
      isOpen: true,
      product: product,
      productId: _id,
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      product: null,
      productId: null,
    });
  };

  const fetchAllProducts = async () => {
    const isAdmin = localStorage.getItem("isAdmin");
    await fetchUnapprovedReviews(isAdmin, setUnapprovedReviews);
    // setIsProcessing(true);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}product/getAllProducts`,
        {
          params: { isAdmin: isAdmin },
        }
      );
      console.log("ProductList Response: ", response);
      if (response.status === 200) {
        const productList = response.data.reverse();
        setProducts(productList);
        setFilteredPaymentInfo(productList);
        setShowUnapprovedReviews(true); // Show unapproved reviews after 2 seconds
        setIsProcessing(false);
        setIsLoading(false);
      } else {
        toast.error("Failed to fetch products. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error occurred while fetching products.");
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    if (e.target.value.toLowerCase() === "") {
      setFilteredPaymentInfo(products);
      setCurrentPage(1);
    } else {
      handleSearchKeyPress(
        e,
        products,
        searchInput,
        setFilteredPaymentInfo,
        setCurrentPage
      );
    }
  };

  const getTotalUnapprovedReviews = () => {
    return Object.values(unapprovedReviews).reduce(
      (acc, count) => acc + count,
      0
    );
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition(); // Or SpeechRecognition in non-WebKit browsers
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setSearchInput(speechResult);
      handleSearchKeyPress(
        { key: "Enter" },
        products,
        searchInput,
        setFilteredPaymentInfo,
        setCurrentPage
      );
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredPaymentInfo.length / itemsPerPage);

  const currentItems = filteredPaymentInfo.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      {isProcessing && (
        <>
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
        </>
      )}
      {isLoading && (
        <div className="overlay">
          <div className="processing-modal">
            <div className="spinner"></div>
            <p>
              <span className="processing">Loading</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </p>
          </div>
        </div>
      )}
      {!isProcessing && isAdmin ? (
        <div className="product-list" style={{ padding: "1px" }}>
          <div className="filter product-list-filter">
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                cursor: "pointer",
                fontSize: "14px",
                backgroundColor: "#074c96",
                color: "#bebaba",
                fontWeight: "bold",
                width: "100%",
                lineHeight: "15px",
                flexWrap: "wrap",
              }}
              className="product-list-h2"
            >
              <span title="refresh the list" onClick={fetchAllProducts}>
                Product List
              </span>

              <input
                className="product-list-search"
                style={{ borderRadius: "30px", maxWidth: "500px" }}
                type="text"
                placeholder="Search BrandName then press enter"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearchKeyPress(
                    e,
                    products,
                    searchInput,
                    setFilteredPaymentInfo,
                    setCurrentPage
                  )
                }
              />
              <div style={{ position: "relative", display: "inline-block" }}>
                <FaMicrophone
                  onClick={startListening}
                  style={{
                    position: "absolute",
                    // left: "1000px",
                    right: "10px",
                    top: "45%",
                    transform: "translateY(-50%)",
                    border: "none",
                    backgroundColor: "transparent",
                    color: isListening ? "#727272" : "#ccc",
                    cursor: "pointer",
                  }}
                  title="Click to Speak"
                />

                {/* <span role="img" aria-label="microphone"></span> */}
              </div>

              <label className="Variant-Label">
                Select Color:
                <select
                  className="Variant-Label"
                  value={selectedColor}
                  onChange={handleColorChange}
                >
                  <option value="">All Colors</option>
                  {Array.from(
                    new Set(
                      products.flatMap((product) =>
                        product.variants.map((variant) => variant.color)
                      )
                    )
                  ).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
              <label className="Variant-Label">
                Select Size:
                <select
                  className="Variant-Label"
                  value={selectedSize}
                  onChange={handleSizeChange}
                >
                  <option value="">All Sizes</option>
                  {Array.from(
                    new Set(
                      products.flatMap((product) =>
                        product.variants.flatMap((variant) =>
                          variant?.sizes?.map((sizeObj) => sizeObj.size)
                        )
                      )
                    )
                  ).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaImages /> Image
                  </th>
                  <th>
                    <FaFolder /> Category
                  </th>
                  <th>
                    <FaFolder /> SubCategory
                  </th>
                  <th>
                    <FaTags /> Brand
                  </th>
                  <th>
                    <FaShoppingBag /> ProductName
                  </th>
                  <th>
                    <FaRupeeSign /> Price
                  </th>
                  <th>
                    <FaCubes /> Quantity
                  </th>
                  <th>
                    <FaIndustry /> Manufacturer
                  </th>
                  <th>
                    <FaBook /> Description
                  </th>
                  <th>Approval</th>
                  <th>
                    <Link to={`/review-list`}>
                      <FaEdit /> ReviewList
                      {showUnapprovedReviews &&
                        getTotalUnapprovedReviews() > 0 && (
                          <span className="badge">
                            {getTotalUnapprovedReviews()} New Reviews!
                          </span>
                        )}
                    </Link>
                  </th>
                  <th>
                    <FaEdit /> Edit / <FaTrash />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => {
                  // Get filtered variant
                  const filteredVariant = getFilteredVariant(product);

                  return (
                    <tr key={product._id}>
                      <td>
                        <img
                          className="product-list-img"
                          title={"Product Image of " + product.brandName}
                          src={product.productImages[0]?.filePath}
                          alt={product.productName}
                        />
                      </td>
                      <td>
                        {product.categoryName.length > 15 ? (
                          <div
                            className="horizontal-scroll"
                            title={product.categoryName}
                          >
                            {product.categoryName}
                          </div>
                        ) : (
                          product.categoryName
                        )}
                      </td>
                      <td>
                        {product.subCategoryName.length > 15 ? (
                          <div
                            className="horizontal-scroll"
                            title={product.subCategoryName}
                          >
                            {product.subCategoryName}
                          </div>
                        ) : (
                          product.subCategoryName
                        )}
                      </td>
                      <td>
                        {product.brandName.length > 15 ? (
                          <div
                            className="horizontal-scroll"
                            title={product.brandName}
                          >
                            {product.brandName}
                          </div>
                        ) : (
                          product.brandName
                        )}
                      </td>
                      <td>
                        <Link to={`/product?id=${product._id}`} key={index}>
                          {product.productName.length > 15 ? (
                            <div
                              className="horizontal-scroll"
                              title={product.productName}
                            >
                              {product.productName}
                            </div>
                          ) : (
                            product.productName
                          )}
                        </Link>
                      </td>
                      <td>
                        {filteredVariant && filteredVariant?.sizes
                          ? filteredVariant?.sizes?.find(
                              (sizeObj) => sizeObj.size === selectedSize
                            )?.price
                          : product?.variants[0]?.sizes[0]?.price || "N/A"}
                      </td>
                      <td>
                        {filteredVariant && filteredVariant?.sizes
                          ? filteredVariant.sizes?.find(
                              (sizeObj) => sizeObj.size === selectedSize
                            )?.quantity
                          : product?.variants[0]?.sizes[0]?.quantity || "N/A"}
                      </td>
                      <td>
                        {product.manufacturer.length > 15 ? (
                          <div
                            className="horizontal-scroll"
                            title={product.manufacturer}
                          >
                            {product.manufacturer}
                          </div>
                        ) : (
                          product.manufacturer
                        )}
                      </td>
                      <td className="des">
                        {product.productDescription.length > 15 ? (
                          <div
                            className="horizontal-scroll"
                            title={product.productDescription}
                          >
                            {product.productDescription}
                          </div>
                        ) : (
                          product.productDescription
                        )}
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={product.isApproved}
                            onChange={() =>
                              handleApprovalToggle(
                                product._id,
                                products,
                                setProducts,
                                fetchAllProducts,
                                setIsLoading
                              )
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <Link to={`/review-list?productId=${product._id}`}>
                          <FaEdit /> ReviewList
                          {showUnapprovedReviews &&
                            unapprovedReviews[product._id] > 0 && (
                              <span className="badge">
                                {unapprovedReviews[product._id]}New Reviews!
                              </span>
                            )}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/add-product?id=${product._id}&id=${product._id}`}
                          style={{ marginRight: "30px" }}
                        >
                          <FaPencilAlt title="Edit the product details" />
                        </Link>
                        <FaTrash
                          title="delete the product data"
                          onClick={() => handleDelete(product._id, product)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredPaymentInfo={filteredPaymentInfo}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
          <div ref={popupRef}>
            <ProductDeleteConfirmationPopup
              isOpen={deleteConfirmation.isOpen}
              product={deleteConfirmation.product}
              onCancel={handleCancelDelete}
              onConfirm={() =>
                handleConfirmDelete(
                  deleteConfirmation,
                  enteredProductName,
                  setProducts,
                  fetchAllProducts,
                  handleCancelDelete
                )
              }
              enteredProductName={enteredProductName}
              handleChange={(e) => setEnteredProductName(e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductList;
