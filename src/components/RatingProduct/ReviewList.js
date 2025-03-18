import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom"; // To access query params
import "./css/ReviewList.css";
import Pagination from "../Pagination/Pagination";
import ImageModal from "./ImageModal"; // Import the modal component
import {
  FaImages,
  FaThumbsUp,
  FaThumbsDown,
  FaRegCalendarPlus,
  FaStar,
  FaComments,
  FaCheck,
  FaHashtag,
  FaEnvelope,
  FaProductHunt,
} from "react-icons/fa";

import {
  handleSearchKeyPress,
  handleUnapprovedReviews,
  toggleApproval,
} from "../VariantReusable";
const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin] = useState(localStorage.getItem("isAdmin"));
  const [searchInput, setSearchInput] = useState("");
  const [filteredPaymentInfo, setFilteredPaymentInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalImages, setModalImages] = useState([]); // State for modal images
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // Index for currently selected image
  const [selectedRating, setSelectedRating] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const productId = query.get("productId");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState("false"); // Default to 'False'

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}review/getAllReviews`,
        {
          params: { isAdmin },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const fetchedReviews = response.data.reverse();
        setReviews(fetchedReviews);
        handleUnapprovedReviews(fetchedReviews, productId);
      } else {
        toast.error("Failed to fetch reviews.");
      }
    } catch (error) {
      toast.error("Failed to fetch reviews.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageClick = (images, index) => {
    setModalImages(images);
    setCurrentImageIndex(index);
  };

  const closeModal = (newIndex) => {
    if (newIndex === -1) {
      setCurrentImageIndex(-1); // Close modal
    } else {
      setCurrentImageIndex(newIndex); // Change image index
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    if (searchInput === "") {
      setFilteredPaymentInfo(filteredReviews);
      setCurrentPage(1);
    }
  };
  const handleRatingFilterChange = (e) => {
    const ratingValue = e.target.value;
    setSelectedRating(ratingValue);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  const handleApprovalStatusChange = (e) => {
    const approvalValue = e.target.value;
    setSelectedApprovalStatus(approvalValue);
    setCurrentPage(1);
  };

  const filteredReviews = useMemo(() => {
    let filtered = productId
      ? reviews.filter((review) => review.productId === productId)
      : reviews;

    if (selectedRating) {
      filtered = filtered.filter(
        (review) => review.rating === Number(selectedRating)
      );
    }
    if (selectedApprovalStatus === "true") {
      filtered = filtered.filter((review) => review.isApproved === true);
    } else if (selectedApprovalStatus === "false") {
      filtered = filtered.filter((review) => review.isApproved === false);
    }

    return filtered;
  }, [productId, reviews, selectedRating, selectedApprovalStatus]);

  useEffect(() => {
    // Set filtered reviews to default on component mount or data update
    setFilteredPaymentInfo(filteredReviews);
  }, [reviews, filteredReviews]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const currentItems = filteredPaymentInfo.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  return (
    <div className="review-list">
      {isLoading ? (
        <div className="skeleton-loader">
          <div className="skeleton-heading"></div>
          <div className="skeleton-table">
            {/* Simulating multiple rows of the table */}
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
      ) : reviews.length > 0 ? (
        <div className="product-list">
          {productId ? (
            <h2 className="filter">
              Newest Reviews for Product ${productId}00{" "}
              <input
                style={{ borderRadius: "30px", maxWidth: "600px" }}
                type="text"
                placeholder="Search by E-mail  then press enter"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyPress={(e) =>
                  handleSearchKeyPress(
                    e,
                    filteredReviews,
                    searchInput,
                    setFilteredPaymentInfo,
                    setCurrentPage
                  )
                }
              />
            </h2>
          ) : (
            <h2 className="filter">
              Newest of All Reviews{" "}
              <input
                style={{ borderRadius: "30px", maxWidth: "600px" }}
                type="text"
                placeholder="Search by E-mail  then press enter"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyPress={(e) =>
                  handleSearchKeyPress(
                    e,
                    filteredReviews,
                    searchInput,
                    setFilteredPaymentInfo,
                    setCurrentPage
                  )
                }
              />
            </h2>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaHashtag /> SrNO
                  </th>
                  <th>
                    <FaEnvelope /> User Email
                  </th>
                  <th>
                    <FaRegCalendarPlus /> Date
                  </th>
                  <th>
                    <FaStar /> Rating:{" "}
                    <select
                      value={selectedRating}
                      onChange={handleRatingFilterChange}
                      style={{ width: "auto", color: "red" }}
                    >
                      <option value="">All</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </th>
                  <th>
                    <FaProductHunt />
                    Product
                  </th>
                  <th>
                    <FaComments /> Comment
                  </th>
                  <th>
                    <FaImages /> Images
                  </th>
                  <th>
                    <FaCheck /> Approved:{" "}
                    <select
                      value={selectedApprovalStatus}
                      onChange={handleApprovalStatusChange}
                      style={{ width: "auto", color: "red" }}
                    >
                      <option value="false">Unapproved</option>
                      <option value="true">Approved</option>
                      <option value="">All</option>
                    </select>
                  </th>
                  <th>
                    {" "}
                    <FaThumbsUp style={{ color: "green" }} />
                    <FaThumbsDown
                      style={{ color: "red", marginLeft: "2px" }}
                    />{" "}
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((review, index) => (
                  <tr
                    key={review._id}
                    className={!review.isApproved ? "highlight" : ""}
                  >
                    <td style={{ width: "50px" }}>
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td>{review.userEmail}</td>
                    <td style={{ width: "180px" }}>{review.createdAt}</td>
                    <td style={{ width: "150px" }}>{review.rating} ★</td>

                    <td>
                      <Link to={`/product?id=${review.productId}`} key={index}>
                        product
                      </Link>
                    </td>
                    <td
                      className="comment-cell"
                      style={{
                        minWidth: "300px",
                        maxWidth: "300px",
                        maxHeight: "100px",
                        overflowX: "auto",
                      }}
                    >
                      {review.comment}
                    </td>
                    <td>
                      {review.reviewImages &&
                        review.reviewImages.length > 0 && (
                          <div style={{ overflowX: "auto", maxWidth: "350px" }}>
                            {review?.reviewImages?.map((image, index) =>
                              image?.type?.startsWith("image") ? (
                                <img
                                  key={index}
                                  src={image.filePath || null}
                                  alt={`user-review-${index + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    margin: "5px",
                                    objectFit: "contain",
                                    cursor: "pointer", // Change cursor to pointer
                                  }}
                                  onClick={() =>
                                    handleImageClick(review.reviewImages, index)
                                  }
                                />
                              ) : image?.type?.startsWith("video") ? (
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                  onClick={() =>
                                    handleImageClick(review.reviewImages, index)
                                  }
                                  key={index}
                                >
                                  <video
                                    // controls
                                    muted
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      margin: "5px",
                                      objectFit: "contain",
                                      cursor: "pointer",
                                      verticalAlign: "middle",
                                    }}
                                    onClick={() =>
                                      handleImageClick(
                                        review.reviewImages,
                                        index
                                      )
                                    }
                                    alt={`user-review-${index + 1}`}
                                  >
                                    <source
                                      key={index}
                                      src={image.filePath}
                                      type={image.type}
                                    />
                                  </video>
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "30px",
                                      color: "white",
                                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                                      borderRadius: "50%",
                                      padding: "10px",
                                      pointerEvents: "none", // Prevent the play icon from blocking clicks
                                    }}
                                  >
                                    ▶
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>
                        )}
                    </td>
                    <td>{review.isApproved ? "True" : "False"}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={!!review.isApproved}
                          onChange={() =>
                            toggleApproval(
                              review._id,
                              review.isApproved,
                              reviews,
                              setReviews,
                              fetchReviews
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
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
            filteredPaymentInfo={filteredReviews}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
          {currentImageIndex >= 0 && ( // Show the modal if an image is selected
            <ImageModal
              images={modalImages}
              currentIndex={currentImageIndex}
              onClose={closeModal}
            />
          )}
        </div>
      ) : (
        <h2>
          {productId
            ? "No reviews found for this product."
            : "No reviews found."}
        </h2>
      )}
    </div>
  );
};

export default ReviewList;
