import React, { useState } from "react";
import AverageStarRating from "./AverageStarRating";
import ImageModal from "./ImageModal";
import { FaTrash, FaThumbsUp } from "react-icons/fa";
// import { handleConfirmDelete } from "../VariantReusable";
import { parse } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
const RenderAllReviewsPopups = ({
  reviews,
  selectedProduct,
  productRatings,
  userEmail,
  fetchAllReviews,
}) => {
  const [modalImages, setModalImages] = useState([]); // State for modal images
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // Index for currently selected image
  const [sortOption, setSortOption] = useState("topReviews"); // Default to 'topReviews'

  const productReviews = reviews.filter(
    (review) => review.productId === (selectedProduct ? selectedProduct : "")
  );
  const userReviewID = reviews.filter(
    (review) =>
      review.productId === (selectedProduct ? selectedProduct : "") &&
      review.userEmail === userEmail
  );
  const handleLikeReview = async (reviewId, userEmail) => {
    console.log(reviewId, userEmail);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}review/likeReview`,
        { reviewId, userEmail }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchAllReviews(selectedProduct); // Refetch reviews to update like count
      }
      toast.info(response?.data?.message);
    } catch (error) {
      console.error("Error liking the review:", error);
      toast.error("An error occurred while liking the review.");
    }
  };
  const calculateRatingPercentages = (reviews) => {
    const totalReviews = reviews.length;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      ratingCounts[review.rating]++;
    });

    return {
      5: ((ratingCounts[5] / totalReviews) * 100).toFixed(0),
      4: ((ratingCounts[4] / totalReviews) * 100).toFixed(0),
      3: ((ratingCounts[3] / totalReviews) * 100).toFixed(0),
      2: ((ratingCounts[2] / totalReviews) * 100).toFixed(0),
      1: ((ratingCounts[1] / totalReviews) * 100).toFixed(0),
    };
  };

  const ratingPercentages = calculateRatingPercentages(productReviews);

  const maskEmail = (email) => {
    const firstPart = email.substring(0, 5);
    const lastPart = email.slice(-3);
    const middleLength = email.length - (firstPart.length + lastPart.length);
    return `${firstPart}${"*".repeat(middleLength)}${lastPart}`;
  };
  const renderRatingBreakdown = (ratingPercentages) => (
    <div className="rating-breakdown">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="rating-bar">
          <span>{rating} star</span>
          <div className="bar-container">
            <div
              className="filled-bar"
              style={{
                width: `${ratingPercentages[rating]}%`,
                backgroundColor: "#f0c14b",
                height: "100%",
              }}
            />
          </div>
          <span>{ratingPercentages[rating]}%</span>
        </div>
      ))}
    </div>
  );
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
  const handleReviewDelete = async (userEmail, productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );
    if (!confirmDelete) return; // Exit if the user cancels the confirmation
    try {
      // setIsLoading(true);
      if (!userEmail) {
        toast.error("User email is required.");
        return;
      }

      if (!productId) {
        toast.error("Product ID is required.");
        return;
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}review/deleteReviews`,
        {
          params: { productId, userEmail },
        }
      );
      if (response.status === 200 || response.status === 204) {
        toast.success("Review deleted successfully.");
      } else if (response.status === 203) {
        toast.info(response.data.message);
      } else {
        toast.error("Failed to delete the review.");
      }
    } catch (error) {
      console.error("Error deleting the review:", error);
      toast.error("An error occurred while deleting the review.");
    } finally {
      // setIsLoading(false);
      fetchAllReviews(selectedProduct);
    }
  };
  const sortByTopReviews = (reviews) => {
    return reviews.sort((a, b) => {
      const likesA = a.likes ? a.likes.length : 0;
      const likesB = b.likes ? b.likes.length : 0;
      if (likesB !== likesA) {
        return likesB - likesA; // Sort by number of likes (most likes first)
      }
      return b.rating - a.rating; // If likes are the same, sort by rating (highest rating first)
    });
  };

  const sortByMostRecent = (reviews) => {
    return reviews.sort((a, b) => {
      const dateA = parse(a.createdAt, "dd/MM/yyyy, h:mm:ss a", new Date());
      const dateB = parse(b.createdAt, "dd/MM/yyyy, h:mm:ss a", new Date());

      return dateB - dateA; // Most recent first
    });
  };
  const getSortedReviews = (reviews) => {
    if (sortOption === "topReviews") {
      return sortByTopReviews([...reviews]); // Spread to avoid mutation
    } else if (sortOption === "mostRecent") {
      return sortByMostRecent([...reviews]);
    }
    return reviews;
  };

  const emptyStar = "☆"; // Unicode for empty star
  const fullStar = "★"; // Unicode for full star
  const disabled = true;
  return (
    <>
      <div className="review-popups">
        <h3 className="h1">Customer Reviews</h3>
        {productReviews.length > 0 && (
          <>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  // alignItems: "center",
                  userSelect: "none",
                }}
              >
                <AverageStarRating
                  // rating={
                  //   productRatings[selectedProduct ? selectedProduct : ""] || 0
                  // }
                  rating={productRatings.averageRating}
                  disabled={disabled}
                />
              </span>
              {/* <span style={{ marginLeft: "5px" }}>
                {productRatings[selectedProduct ? selectedProduct : ""] ||
                  "No rating yet"}{" "}
                out of 5<div></div>
              </span> */}
              <span style={{ marginLeft: "5px" }}>
                {productRatings.averageRating || "No rating yet"} out of 5
                <div></div>
              </span>
              <span>{productReviews.length} global ratings</span>
            </div>
            {renderRatingBreakdown(ratingPercentages)}
            <div>
              <select
                id="sortReviews"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="topReviews">Top Reviews</option>
                <option value="mostRecent">Most Recent</option>
              </select>
            </div>

            {getSortedReviews(productReviews).map((review, index) => (
              <div key={index}>
                <strong>{maskEmail(review.userEmail)}</strong>
                <div>
                  <span>
                    {[...Array(5)].map((_, index) => {
                      index += 1; // Start at 1 instead of 0
                      return (
                        <span
                          key={index}
                          style={{
                            color: index <= review.rating ? "gold" : "grey",
                          }}
                        >
                          {index <= review.rating ? fullStar : emptyStar}
                        </span>
                      );
                    })}
                  </span>
                  <span> on {review.createdAt?.split(",")[0]}</span>
                </div>
                {review.comment && <p>{review.comment}</p>}
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div>
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
                          }}
                          onClick={() =>
                            handleImageClick(review.reviewImages, index)
                          }
                        />
                      ) : image?.type?.startsWith("video") ? (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                          onClick={() =>
                            handleImageClick(review.reviewImages, index)
                          }
                        >
                          <video
                            // controls
                            muted
                            style={{
                              width: "150px",
                              height: "150px",
                              margin: "5px",
                              objectFit: "contain",
                              verticalAlign: "middle",
                            }}
                            key={index}
                            onClick={() =>
                              handleImageClick(review.reviewImages, index)
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
                              pointerEvents: "none",
                            }}
                          >
                            ▶
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    onClick={() => handleLikeReview(review._id, userEmail)}
                    className="like-button"
                  >
                    <FaThumbsUp
                      style={{
                        color: review?.likes?.includes(userEmail)
                          ? "blue"
                          : "grey",
                      }}
                    />{" "}
                    {review?.likes?.length > 0 && review?.likes?.length} Likes
                  </span>

                  {userReviewID.length > 0 &&
                    review.userEmail === userReviewID[0].userEmail && (
                      <FaTrash
                        onClick={() =>
                          handleReviewDelete(userEmail, selectedProduct)
                        }
                        title="delete review"
                      />
                    )}
                </div>
                <hr />
              </div>
            ))}
            {currentImageIndex >= 0 && (
              <ImageModal
                images={modalImages}
                currentIndex={currentImageIndex}
                onClose={closeModal}
              />
            )}
          </>
        )}
        {productReviews.length === 0 && (
          <p>No reviews available for this product.</p>
        )}
      </div>
    </>
  );
};

export default RenderAllReviewsPopups;
