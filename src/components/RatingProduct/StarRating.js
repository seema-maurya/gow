import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RenderAllReviewsPopups from "./RenderAllReviewsPopups.js";
import { FaTimes } from "react-icons/fa";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const StarRating = ({
  product_ID,
  fetchProductRatings,
  productRatings,
  setShowReviewPopup,
  disabled,
}) => {
  const [reviews, setReviews] = useState([]);
  const [userRatingss, setUserRating] = useState(0);
  const [userCommentss, setUserComment] = useState("");
  const [userImages, setUserImages] = useState([]);
  const [submitReviewPopup, setSubmitReviewPopup] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail") || "";
  const [largeImage, setLargeImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [getReviews, setGetReviews] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (disabled) return;
      if (!isMounted) return;
      await fetchProductReviews(product_ID);
      await fetchAllReviews(product_ID);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, product_ID]);

  const userReview = getReviews?.find(
    (review) =>
      review.productId === product_ID && review.userEmail === userEmail
  );
  const userRating = userReview ? userReview.rating : 0;
  const userComment = userReview ? userReview.comment : "";
  const userReviewImages = userReview ? userReview.reviewImages || [] : [];

  const handleRatingSelect = (index, productRatingID) => {
    setUserRating(index);
    let updatedReviews = [...reviews];

    const existingReviewIndex = updatedReviews.findIndex(
      (review) =>
        review.productId === productRatingID && review.userEmail === userEmail
    );

    if (existingReviewIndex !== -1) {
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        rating: index,
      };
      // setExistingReview(updatedReviews[existingReviewIndex]);
    } else {
      updatedReviews.push({
        productId: productRatingID,
        userEmail: userEmail,
        rating: index,
        comment: "", // Start with an empty comment
      });
      // setExistingReview(null);
    }

    // setReviews(updatedReviews);
  };

  const handleReviewCommentChange = (e, product_ID) => {
    const comment = e.target.value;
    setUserComment(comment);
    const userEmail = localStorage.getItem("userEmail") || "";

    let updatedReviews = [...reviews];

    const existingReviewIndex = updatedReviews.findIndex(
      (review) =>
        review.productId === product_ID && review.userEmail === userEmail
    );

    if (existingReviewIndex !== -1) {
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        comment,
      };
      // setExistingReview(updatedReviews[existingReviewIndex]);
    } else {
      updatedReviews.push({
        productId: product_ID,
        userEmail: userEmail,
        rating: 0,
        comment: comment,
      });
      // setExistingReview(null);
    }
    // setReviews(updatedReviews);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const selectedColor = {};
    // Check if a color is selected
    // if (!selectedColor) {
    //   toast.info("Please select a color before uploading files.");
    //   return;
    // }

    // Check if the total number of files exceeds 15
    if (
      files.length + (Array.isArray(userImages) ? userImages.length : 0) >
      15
    ) {
      alert("You can only upload a maximum of 15 files (images or videos).");
      return;
    }

    try {
      const updatedFiles = Array.isArray(userImages) ? [...userImages] : [];
      const filePromises = Array.from(files).map(async (file, index) => {
        const fileType = file.type.split("/")[0]; // Detect 'image' or 'video'
        const allowedImageFormats = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const allowedVideoFormats = ["video/mp4", "video/webm", "video/ogg"];

        // Handle Image Upload
        if (fileType === "image" && allowedImageFormats.includes(file.type)) {
          if (file.size <= 5 * 1024 * 1024) {
            // Check file size (5MB limit)
            const base64String = await fileToBase64(file);
            return {
              dataURL: base64String, // Ensure this is a valid base64 string
              fileName: file.name,
              type: file.type, // Exact MIME type like image/jpeg
              size: Math.round(file.size / 1024), // Size in KB
              description: `${
                fileType.charAt(0).toUpperCase() + fileType.slice(1)
              } for ${selectedColor}`,
              color: selectedColor,
              filePath: `/home/ClothingImages/${file.name.split(".")[0]}.${
                file.type.split("/")[1]
              }.webp`, // Correctly formatted file path
              status: 1, // Active status
            };
          } else {
            throw new Error(
              `Image ${file.name} is too large. Maximum size is 5MB.`
            );
          }

          // Handle Video Upload
        } else if (
          fileType === "video" &&
          allowedVideoFormats.includes(file.type)
        ) {
          if (file.size <= 50 * 1024 * 1024) {
            // Set a file size limit for videos (50MB)
            const base64String = await fileToBase64(file);
            return {
              dataURL: base64String, // Ensure this is a valid base64 string
              fileName: file.name,
              type: file.type, // Exact MIME type like video/mp4
              size: Math.round(file.size / 1024), // Size in KB
              description: `video ${
                fileType.charAt(0).toUpperCase() + fileType.slice(1)
              } for ${selectedColor}`,
              color: selectedColor,
              filePath: `/home/ClothingImages/${file.name.split(".")[0]}.${
                file.type.split("/")[1]
              }`, // Correctly formatted file path
              status: 1, // Active status
            };
          } else {
            throw new Error(
              `Video ${file.name} is too large. Maximum size is 50MB.`
            );
          }
        } else {
          throw new Error(
            `Unsupported file type or file too large. File: ${file.name}`
          );
        }
      });

      // Process all file promises
      const newFiles = await Promise.all(filePromises);
      setUserImages([...updatedFiles, ...newFiles]);
    } catch (error) {
      console.error("Error uploading files:", error.message);
      alert(error.message);
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...userImages];
    updatedImages.splice(index, 1);
    setUserImages(updatedImages);
  };

  const fetchAllReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}review/getAllReviews`,
        {
          params: { productId },
        }
      );
      console.log("getAllreviews", response.data);

      if (response.status === 200) {
        setReviews(response.data);
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Failed to fetch reviews: ${
            error.response.data.message || "Server Error"
          }`
        );
      } else if (error.request) {
        console.error("Failed to fetch reviews: No response from server");
      } else {
        console.error(`Failed to fetch reviews: ${error.message}`);
      }
    }
  };

  const submitReview = async (productId) => {
    if (!userEmail) {
      toast.warning("Please log in to submit a review.");
      window.location.href = "/login";
      return;
    }
    try {
      // const userReview = reviews.find(
      //   (review) =>
      //     review.productId === productId && review.userEmail === userEmail
      // );

      if (!userRatingss || userRatingss === 0) {
        toast.warning("Please select a rating before submitting.");
        return;
      }
      const reviewData = {
        productId,
        userEmail,
        rating: userRatingss,
        comment: userCommentss,
        images: userImages,
      };

      const existingReviewResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}review/getReviews`,
        { params: { productId, userEmail } }
      );

      const existingReview = existingReviewResponse.data;
      if (existingReview?.length > 0) {
        const currentRating = existingReview[0].rating;
        const currentComment = existingReview[0].comment;
        const currentImage = existingReview[0]?.reviewImages;

        if (
          currentRating === userRatingss &&
          currentComment === userCommentss &&
          JSON.stringify(currentImage) === JSON.stringify(userImages)
        ) {
          toast.warning("You cannot submit the same rating and comment again.");
          return;
        }
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}review/updateReviews`,
          reviewData
        );
        if (response.status === 203) {
          toast.info("you dont have a access: " + response.data.message);
          console.log(response);
        } else {
          toast.success("Review updated-Thank you!!");
          toast.success(
            "we are processing your review. This might take several days, so we appreciate your patience. we will email you when this is complete."
          );
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}review/reviews`,
          reviewData
        );
        console.log(response);
        if (response.status === 203) {
          toast.info("you dont have a access: " + response.data.message);
          console.log(response);
        } else {
          toast.success("Review submitted-Thank you!");
          toast.success(
            "we are processing your review. This might take several days, so we appreciate your patience. we will email you when this is complete."
          );
        }
      }
      // setReviews([...reviews, userReview]);
      // fetchAllReviewsRating();
      fetchProductReviews(productId);
      // fetchProductRatings();
      setShowReviewPopup(false);
    } catch (error) {
      console.error("Error submitting review:", error.response || error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}review/getReviews`,
        {
          params: { productId, userEmail },
        }
      );
      if (response.data.length > 0) {
        const { rating, comment, reviewImages } = response.data[0];
        setUserRating(rating);
        setUserComment(comment);
        setUserImages(reviewImages);
        setGetReviews(response.data);
        console.log("getReviews", response.data);
      }
      if (response.status === 203) {
        toast.info(response.data.message);
        console.log("status 203", response);
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const openImageLargeView = (imageURL, index) => {
    setLargeImage(imageURL);
    setCurrentIndex(index);
  };
  const closeImageLargeView = () => {
    setLargeImage(null); // Close the large image view by setting it to null
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    // Go to the previous image, wrapping around if necessary
    const newIndex = (currentIndex - 1 + userImages.length) % userImages.length;
    setCurrentIndex(newIndex); // Update to the new index
    setLargeImage(userImages[newIndex].filePath); // Update the large image
  };

  const handleNext = () => {
    // Go to the next image, wrapping around if necessary
    const newIndex = (currentIndex + 1) % userImages.length;
    setCurrentIndex(newIndex); // Update to the new index
    setLargeImage(userImages[newIndex].filePath); // Update the large image
  };

  const isSubmitButtonDisabled = () => {
    const isRatingSelected = userRatingss && userRatingss > 0;

    const isRatingChanged = userRatingss !== userRating;
    const isCommentChanged = userCommentss
      ? userCommentss.trim() !== userComment
      : userComment && userComment.trim().length > 0;

    const isImagesChanged =
      userImages && userReviewImages
        ? JSON.stringify(userImages) !== JSON.stringify(userReviewImages)
        : userReviewImages && userReviewImages.length > 0;

    // Enable button if any field has changed (rating, comment, or images)
    const hasAnyChanges =
      isRatingSelected &&
      (isRatingChanged || isCommentChanged || isImagesChanged);

    // Button is disabled only if no changes are made
    return !hasAnyChanges;
  };

  return (
    <>
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
      {!disabled && (
        <div className="star-rating">
          {submitReviewPopup && (
            <div>
              {getReviews.length > 0 && (
                <p style={{ color: "green" }}>
                  You already reviewed for this product.You've been Redirected
                  to edit that review.
                </p>
              )}
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <span
                    type="button"
                    key={index}
                    className={
                      index <= userRatingss && userRatingss ? "on" : "off"
                    }
                    onClick={() => handleRatingSelect(index, product_ID)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    <span
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      className="star"
                    >
                      &#9733;
                    </span>
                  </span>
                );
              })}
              <>
                <textarea
                  placeholder="Write your review here..."
                  onChange={(e) => handleReviewCommentChange(e, product_ID)}
                  value={userCommentss ? userCommentss : ""}
                  rows="3"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "5px",
                    fontSize: "16px",
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ marginTop: "10px" }}
                />
                {userImages && userImages.length > 0 && (
                  <div className="review-image">
                    {userImages.map((image, index) => (
                      <div
                        className="image-review-item"
                        key={index}
                        onClick={() => openImageLargeView(image.filePath, index)}
                      >
                        {image && image?.type?.startsWith("image") ? (
                          <img
                            key={index}
                            src={image.filePath || null}
                            alt={`user-review-${index + 1}`}
                            style={
                              {
                                // width: "100px",
                                // height: "100px",
                                // margin: "5px",
                                // objectFit: "contain",
                              }
                            }
                          />
                        ) : image?.type?.startsWith("video") ? (
                          <div className="image-review-item">
                            <video
                            // controls
                            >
                              <source
                                src={image.filePath || null}
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
                        ) : null}
                        <FaTimes
                          className="review-delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(index);
                          }}
                          title="clear image modal"
                        />
                      </div>
                    ))}
                    {largeImage && (
                      <div
                        className="large-image-modal"
                        onClick={closeImageLargeView}
                      >
                        <div
                          className="large-image-wrapper"
                          onClick={(e) => e.stopPropagation()} // Prevents the modal from closing when clicking the image
                        >
                          <FaTimes
                            className="close-modal review-delete-icon"
                            title="close image modal"
                            onClick={closeImageLargeView}
                          />
                          <div className="image-modal-container">
                            <button
                              className="image-modal-arrow left"
                              onClick={handlePrev}
                            >
                              &lt;
                            </button>

                            {largeImage &&
                            largeImage?.startsWith("data:image") ? (
                              <img
                                className="large-image-modal-img"
                                src={largeImage || null}
                                alt="Large view"
                              />
                            ) : largeImage &&
                              largeImage?.startsWith("data:video") ? (
                              <video className="large-image-modal-img" controls>
                                <source
                                  src={largeImage || null}
                                  type={largeImage?.substring(
                                    5,
                                    largeImage?.indexOf(";")
                                  )}
                                />
                              </video>
                            ) : null}
                            <button
                              className="image-modal-arrow right"
                              onClick={handleNext}
                            >
                              &gt;
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => submitReview(product_ID)}
                  disabled={isSubmitButtonDisabled()}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    fontSize: "16px",
                    cursor: isSubmitButtonDisabled()
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  Submit Review
                </button>
              </>
            </div>
          )}

          <div>
            <h3
              className="review-toggle"
              onClick={() => {
                setSubmitReviewPopup(!submitReviewPopup);
              }}
              style={{
                backgroundColor: !submitReviewPopup ? "#f2f2f1" : "",
                padding: "8px 16px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {!submitReviewPopup ? "Write Reviews" : "See Customer Reviews"}
            </h3>
          </div>
          {!submitReviewPopup && (
            <>
              <RenderAllReviewsPopups
                reviews={reviews}
                selectedProduct={product_ID}
                productRatings={productRatings}
                userEmail={userEmail}
                fetchAllReviews={fetchAllReviews}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default StarRating;
