// VariantReusable.js
import { useState, useEffect } from "react";
// import debounce from "lodash/debounce";
import axios from "axios";
import { toast } from "react-toastify";
// import { filterLatestProducts } from "./cartFunctions";

// Function to handle image hover
export const handleImageHover = (
  imageUrl,
  color,
  variantColor,
  setMainImage,
  setHoveredColor,
  setSelectedColor
) => {
  setMainImage(imageUrl);
  setHoveredColor(color);
  if (variantColor) {
    if (variantColor.trim().toLowerCase() === color.trim().toLowerCase()) {
      setSelectedColor(variantColor);
    }
  }
};

export const getSizeOptions = (variants, selectedColor) => {
  const selectedVariant =
    variants &&
    variants.find(
      (variant) =>
        variant.color.trim().toLowerCase() ===
        selectedColor.trim().toLowerCase()
    );
  return selectedVariant ? selectedVariant.sizes : [];
};
// Function to handle size change
export const handleSizeChange = (productId, e, setSelectedSizes) => {
  const selectedSize = e.target.value;
  setSelectedSizes((prevSizes) => ({
    ...prevSizes,
    [productId]: selectedSize,
  }));
};

// Function to get variant details
export const getVariantDetails = (
  variants,
  selectedColor,
  selectedSizeVariants
) => {
  if (!Array.isArray(variants)) {
    return {}; // Return an empty object if variants is not an array
  }

  const colorVariant = variants.find(
    (variant) =>
      variant.color.trim().toLowerCase() === selectedColor.trim().toLowerCase()
  );
  if (colorVariant) {
    const sizeDetail = colorVariant.sizes.find(
      (size) => size.size === selectedSizeVariants
    );
    return sizeDetail || {};
  }
  return {};
};

// Function to calculate discount percentage Important
export const calculateDiscountPercentage = (mrp, price) => {
  return Math.round(((mrp - price) / mrp) * 100) || 0;
};

export const findVariantCartItem = (
  cart,
  productId,
  selectedColor,
  selectedSizeVariants
) => {
  return cart.find(
    (item) =>
      item._id === productId &&
      item.selectedColor.trim().toLowerCase() ===
        selectedColor.trim().toLowerCase() &&
      item.selectedSizes === selectedSizeVariants
  );
};

// Fetch product variant details and prices
export const useProductVariantDetails = (
  product,
  selectedColor,
  selectedSizeVariants
  // quantityPurchased
) => {
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantMrpPrice, setVariantMrpPrice] = useState(0);
  const [cartVariantQuantity, setCartVariantQuantity] = useState(0);
  const [QuantityPurchased, setQuantityPurchased] = useState(0);
  useEffect(() => {
    const variantDetails = getVariantDetails(
      product.variants,
      selectedColor,
      selectedSizeVariants
    );
    setVariantPrice(variantDetails.price || 0);
    setVariantMrpPrice(variantDetails.mrpPrice || 0);
    setCartVariantQuantity(variantDetails.quantity || 0);
    setQuantityPurchased(variantDetails.quantityPurchased || "");
  }, [selectedColor, selectedSizeVariants, product.variants]);

  return {
    variantPrice,
    variantMrpPrice,
    cartVariantQuantity,
    QuantityPurchased,
  };
};

export const handleShareClick = (product) => {
  const shareUrl = window.location.href; // Get current page URL
  const shareText = `${product.productName} - Check this out!`;

  // Check if the Web Share API is supported
  if (navigator.share) {
    navigator
      .share({
        title: shareText,
        url: shareUrl,
      })
      .then(() => console.log("Share successful"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    // Fallback for browsers that do not support the Web Share API
    const emailBody = `Check out this product: ${shareUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      shareText
    )}&body=${encodeURIComponent(emailBody)}`;
    window.open(emailUrl, "_self");
  }
};

// Extracted reusable function (can be used in both functional and class components)
export const getProductVariantDetails = (
  product,
  selectedColor,
  selectedSizeVariants
) => {
  if (!product || !product.variants) {
    return { variantPrice: 0, variantMrpPrice: 0, cartVariantQuantity: 0 };
  }

  const variantDetails = getVariantDetails(
    product.variants,
    selectedColor,
    selectedSizeVariants
  );

  return {
    variantPrice: variantDetails.price || 0,
    variantMrpPrice: variantDetails.mrpPrice || 0,
    cartVariantQuantity: variantDetails.quantity || 0,
  };
};

export const updateVariantDetails = (
  product,
  selectedOptions,
  setSelectedOptions
) => {
  const selectedOptionsProduct = selectedOptions[product._id] || {};
  const selectedColor = selectedOptionsProduct.color || "";
  const selectedSizeVariants = selectedOptionsProduct.size || "";

  const { variantPrice, variantMrpPrice, cartVariantQuantity } =
    getProductVariantDetails(product, selectedColor, selectedSizeVariants);

  setSelectedOptions((prevOptions) => ({
    ...prevOptions,
    [product._id]: {
      ...prevOptions[product._id],
      variantPrice,
      variantMrpPrice,
      cartVariantQuantity,
    },
  }));
};

export const handleSearchKeyPress = (
  e,
  products,
  searchInput,
  setFilteredPaymentInfo,
  setCurrentPage
) => {
  const trimmedSearchInput = searchInput.trim(); // Trim the input here

  if (trimmedSearchInput) {
    if (e.key === "Enter") {
      const searchFields = [
        "_id",
        "categoryName",
        "subCategoryName",
        "brandName",
        "productName",
        "productQuantity",
        "productPrice",
        "productMrpPrice",
        "userEmail",
        "createdAt",
        "isApproved",
        "comment",
        "InvoiceNumber",
        "rating",
      ];

      const searchTerms = trimmedSearchInput
        .split(" ")
        .map((term) => term.toLowerCase().trim())
        .filter((term) => term.length > 0);

      const filteredPaymentInfo = products.filter((prod) => {
        return searchFields.some((field) => {
          const fieldValue = prod[field];

          if (typeof fieldValue === "number") {
            return searchTerms.some((term) =>
              fieldValue.toString().includes(term)
            );
          } else if (typeof fieldValue === "string") {
            return searchTerms.some((term) =>
              fieldValue.toLowerCase().includes(term)
            );
          } else if (typeof fieldValue === "boolean") {
            const boolStr = fieldValue ? "true" : "false";
            return searchTerms.some((term) => boolStr.includes(term));
          }
          return false;
        });
      });

      setFilteredPaymentInfo(filteredPaymentInfo);
      setCurrentPage(1);
    }
  }
};

export const handleApprovalToggle = async (
  productId,
  products,
  setProducts,
  fetchAllProducts
) => {
  const productToUpdate = products.find((p) => p._id === productId);

  if (!productToUpdate) return;

  const updatedApprovalStatus = !productToUpdate.isApproved;

  setProducts((prevProducts) =>
    prevProducts.map((p) =>
      p._id === productId ? { ...p, isApproved: updatedApprovalStatus } : p
    )
  );

  try {
    const response = await axios.put(
      process.env.REACT_APP_API_URL +
        `product/updateApprovalStatus/${productId}`,
      { isApproved: updatedApprovalStatus }
    );

    if (response.status === 200) {
      toast.success(
        `Product ${
          updatedApprovalStatus ? "approved" : "disapproved"
        } successfully.`
      );
    } else {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, isApproved: !updatedApprovalStatus } : p
        )
      );
      toast.error("Failed to update approval status.");
    }
  } catch (error) {
    console.error("Error updating approval status:", error);
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === productId ? { ...p, isApproved: !updatedApprovalStatus } : p
      )
    );
    toast.error("Error updating approval status.");
  }

  await fetchAllProducts();
};

export const fetchUnapprovedReviews = async (isAdmin, setUnapprovedReviews) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}review/getAllReviews`,
      {
        params: { isAdmin },
      }
    );
    if (response.status === 200) {
      const reviewsList = response.data.reverse();
      const unapprovedReviewCount = reviewsList.reduce((acc, review) => {
        if (!review.isApproved) {
          acc[review.productId] = (acc[review.productId] || 0) + 1;
        }
        return acc;
      }, {});

      setUnapprovedReviews(unapprovedReviewCount);
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

export const handleConfirmDelete = async (
  deleteConfirmation,
  enteredProductName,
  setProducts,
  fetchAllProducts,
  handleCancelDelete
) => {
  const { product } = deleteConfirmation;

  if (enteredProductName.trim() !== product.brandName.trim()) {
    toast.warning("Brand name does not match. Deletion cancelled.");
    return;
  }

  try {
    const response = await axios.delete(
      process.env.REACT_APP_API_URL + `product/deleteProduct/${product._id}`
    );

    if (response.status === 200) {
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== product._id)
      );
      toast.success("Deleted successfully");
      fetchAllProducts();
    } else {
      toast.error("Failed to delete");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Error occurred while deleting the product.");
  }

  handleCancelDelete();
};

export const handleUnapprovedReviews = (fetchedReviews, productId) => {
  const productReviews = fetchedReviews.filter(
    (review) => review.productId === productId
  );

  const newUnapprovedCount = productReviews.filter(
    (review) => !review.isApproved
  ).length;

  const allUnapprovedCount = fetchedReviews.filter(
    (review) => !review.isApproved
  ).length;

  // Show toast based on productId or all reviews
  if (productId) {
    if (newUnapprovedCount > 0 && productReviews.length > 0) {
      toast.dismiss();
      toast.info(
        `There are ${newUnapprovedCount} new reviews pending approval for this product.`
      );
    }
  } else {
    if (allUnapprovedCount > 0 && fetchedReviews.length > 0) {
      toast.dismiss();
      toast.info(
        `There are ${allUnapprovedCount} new reviews pending approval across all products.`
      );
    }
  }
};

export const toggleApproval = async (
  reviewId,
  currentApprovalStatus,
  reviews,
  setReviews,
  fetchReviews
) => {
  const reviewIdUpdate = reviews.find((review) => review._id === reviewId);
  if (!reviewIdUpdate) {
    // toast.dismiss();
    toast.info("Review not found", { theme: "colored" });
    return;
  }
  const updatedApprovalStatus = !reviewIdUpdate.isApproved;
  const currentVersion = reviewIdUpdate.version; // Include the version

  setReviews((prevReview) =>
    prevReview.map((review) =>
      review._id === reviewId
        ? { ...review, isApproved: updatedApprovalStatus }
        : review
    )
  );

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}review/reviewApprovalStatus/${reviewId}`,
      { isApproved: !currentApprovalStatus, version: currentVersion }
    );
    if (response.status === 200) {
      toast.dismiss();
      toast.success("Review approval status updated.");
    } else {
      setReviews((prevReview) =>
        prevReview.map((review) =>
          review._id === reviewId
            ? { ...review, isApproved: !updatedApprovalStatus }
            : review
        )
      );
      toast.error("Failed to update review approval status.");
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      const { isApproved } = error.response.data;

      toast(
        `Another admin has already updated this review. Current approval status: ${
          isApproved ? "Approved" : "Not Approved"
        }. Refetching latest data.`
      );
      console.log(error.response);
    } else {
      setReviews((prevReview) =>
        prevReview.map((p) =>
          p._id === reviewId ? { ...p, isApproved: !updatedApprovalStatus } : p
        )
      );

      toast.error("Failed to update review approval status.");
      console.error("Error:", error);
    }
  }
  await fetchReviews();
};

export const setVariantAll = async (products, setSelectedOptions) => {
  if (products && products.length > 0) {
    // Iterate over all products and set default color and size for each
    const updatedOptions = {};

    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        const defaultColor = product.variants[0].color;
        const defaultSize =
          product.variants[0].sizes && product.variants[0].sizes.length > 0
            ? product.variants[0].sizes[0].size
            : "";

        updatedOptions[product._id] = {
          color: defaultColor,
          size: defaultSize,
          variantPrice: product.variants[0].sizes[0].price,
          variantMrpPrice: product.variants[0].sizes[0].mrpPrice,
          cartVariantQuantity: product.variants[0].sizes[0].quantity || "",
        };
      }
    });

    setSelectedOptions(updatedOptions);
  }
}; // Add products as a dependency

export const useImageZoom = (imgRef, resultRef, setCx, setCy) => {
  const handleImageLoad = () => {
    try {
      const imgRefCurrent = imgRef.current;
      const resultRefCurrent = resultRef.current;

      if (!imgRefCurrent || !resultRefCurrent) {
        console.error("Image or result reference is null");
        return;
      }

      let lens = document.querySelector(".img-zoom-lens");

      // Create lens if it doesn't exist
      if (!lens) {
        lens = document.createElement("div");
        lens.setAttribute("class", "img-zoom-lens");
        imgRefCurrent.parentElement.insertBefore(lens, imgRefCurrent);
      } else {
        lens.style.display = "block"; // Ensure lens is visible
        resultRefCurrent.style.display = "block";
      }

      const cx = resultRefCurrent.offsetWidth / lens.offsetWidth;
      const cy = resultRefCurrent.offsetHeight / lens.offsetHeight;

      setCx(cx);
      setCy(cy);

      resultRefCurrent.style.backgroundImage = `url('${imgRefCurrent.src}')`;
      resultRefCurrent.style.backgroundSize = `${imgRefCurrent.width * cx}px ${
        imgRefCurrent.height * cy
      }px`;

      const moveLensHandler = (e) => moveLens(e, imgRef, resultRef, cx, cy);
      lens.addEventListener("mousemove", moveLensHandler);
      imgRefCurrent.addEventListener("mousemove", moveLensHandler);
      lens.addEventListener("touchmove", moveLensHandler);
      imgRefCurrent.addEventListener("touchmove", moveLensHandler);

      // Cleanup event listeners on unmount
      return () => {
        lens.removeEventListener("mousemove", moveLensHandler);
        imgRefCurrent.removeEventListener("mousemove", moveLensHandler);
        lens.removeEventListener("touchmove", moveLensHandler);
        imgRefCurrent.removeEventListener("touchmove", moveLensHandler);
      };
    } catch (error) {
      console.error("Error in handleImageLoad:", error);
    }
  };

  const moveLens = (e, imgRef, resultRef, cx, cy) => {
    try {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x - imgRef.current.offsetWidth / 2;
      let y = pos.y - imgRef.current.offsetHeight / 2;

      if (x > imgRef.current.width - 40) x = imgRef.current.width - 40;
      if (x < 0) x = 0;
      if (y > imgRef.current.height - 40) y = imgRef.current.height - 40;
      if (y < 0) y = 0;

      const lens = document.querySelector(".img-zoom-lens");
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      resultRef.current.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    } catch (error) {
      console.error("Error in moveLens:", error);
    }
  };

  const getCursorPos = (e) => {
    try {
      let x = 0,
        y = 0;
      const imgRect = imgRef.current.getBoundingClientRect();
      x = e.pageX - imgRect.left - window.pageXOffset;
      y = e.pageY - imgRect.top - window.pageYOffset;
      return { x, y };
    } catch (error) {
      console.error("Error in getCursorPos:", error);
      return { x: 0, y: 0 };
    }
  };

  return { handleImageLoad };
};
