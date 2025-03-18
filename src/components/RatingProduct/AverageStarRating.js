import React, { useState, useRef, useEffect } from "react";
import StarRating from "./StarRating";
import "./css/AverageStarRating.css";
// import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AverageStarRating = ({
  productRatings,
  rating,
  productId,
  fetchProductRatings,
  disabled,
}) => {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const popupRef = useRef(null); // Reference for the popup

  const numberOfStars = 5;
  const roundedRating = rating ? Math.round(rating * 2) / 2 : 0;
  // Close the popup when clicking outside
  // const productReviews = reviews.filter(
  //   (review) => review.productId === (productId ? productId : "")
  // );
  console.log(disabled, "AVerageRating disabled");
  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowReviewPopup(false);
      }
    };
    if (showReviewPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReviewPopup]);

  const handleClick = () => {
    setShowReviewPopup(!showReviewPopup);
  };
  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowReviewPopup(false);
  };

  return (
    <div
      className="star-rating"
      onClick={!disabled ? handleClick : undefined}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {[...Array(numberOfStars)].map((_, index) => {
        const starIndex = index + 1;
        let starClass = "star-off";
        if (rating !== null) {
          if (starIndex <= Math.floor(roundedRating)) {
            starClass = "star-on";
          } else if (starIndex - 0.5 === roundedRating) {
            starClass = "star-partial";
          }
        }

        return (
          <span key={index} className={`star ${starClass}`}>
            <span
              style={{ cursor: disabled ? "" : "pointer" }}
              className="star-background"
            >
              &#9733;
            </span>
          </span>
        );
      })}
      {productRatings && productRatings.reviewCount > 0 && (
        <span style={{ marginLeft: "10px", color: "#666565" }}>
          {productRatings.reviewCount} ratings
        </span>
      )}
      {showReviewPopup && (
        <div className="image-modal-overlay">
          <div
            className="popupReviews"
            ref={popupRef} // Reference for the popup
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="popup-title"
            aria-describedby="popup-description"
          >
            <FaTimes
              onClick={handleClosePopup}
              style={{ cursor: "pointer" }}
              title="Close"
            />
            <div className="review-content">
              <StarRating
                product_ID={productId}
                fetchProductRatings={fetchProductRatings}
                productRatings={productRatings}
                setShowReviewPopup={setShowReviewPopup}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageStarRating;
