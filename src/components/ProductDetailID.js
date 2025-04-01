import React, { useState, useEffect } from "react";
import "../css/ProductDetailID.css";
// import ProceedToPay from "./ProceedToPay.js";
import { Link, useNavigate } from "react-router-dom";
// import { useCallback } from "react";
import debounce from "lodash/debounce";

import {
  // handleSizeChange,
  // handleRefreshPage,
  calculateTotal,
  // fetchAllCart,
  // getProductDefaultSize,
  handleVariantAddToCart,
  handleRemoveFromCart2Variant,
} from "./cartFunctions.js";
import {
  // handleImageHover,
  // handleSizeChange,
  // handleShareClick,
  getVariantDetails,
  calculateDiscountPercentage,
  useProductVariantDetails,
  getSizeOptions,
  findVariantCartItem,
} from "./VariantReusable.js";

import { FaMinus, FaPlus, FaShareAlt } from "react-icons/fa";
import ProductPage from "./RatingProduct/ProductPage";
import { useCart } from "./CartContext.js";

const ProductDetailID = ({ product, selectedColorChoose, sizeChoose }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Track mouse position for zoom
  const [isZoomed, setIsZoomed] = useState(false); // Toggle zoom state
  const [userEmail] = useState(localStorage.getItem("userEmail"));

  const handleZoomToggle = (isHovering) => {
    setIsZoomed(isHovering);
  };

  const [mainImage, setMainImage] = useState("");
  const [mainImageType, setMainImageType] = useState("");
  const [hoveredColor, setHoveredColor] = useState(""); // Add state to track hovered image color
  const [isVisible] = useState(true);
  // const [selectedSizes, setSelectedSizes] = useState(
  //   JSON.parse(localStorage.getItem("selectedSizes")) || {}
  // );
  // const [cart, setCart] = useState([]);
  const { cart, setCart, selectedSizes, setSelectedSizes } = useCart();

  const [selectedSizeVariants, setSelectedSizeVariants] = useState(""); // Track selected color today
  const [selectedColor, setSelectedColor] = useState(""); // Track selected color today
  const [quantityPurchased, setQuantityPurchased] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate
  const handleMouseMove = debounce((e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { width, height } = target.getBoundingClientRect();
    const xPercent = (offsetX / width) * 100;
    const yPercent = (offsetY / height) * 100;
    setZoomPosition({ x: xPercent, y: yPercent });
  });
  const SubTotal = calculateTotal(cart);
  const finalAmountToPay = (SubTotal * 1.12).toFixed(2);
  const Tax = (SubTotal * 0.12).toFixed(2);

  // const handleProceedToPayClick = () => {
  //   setIsVisible(false);
  // };

  const {
    variantPrice,
    variantMrpPrice,
    cartVariantQuantity,
    QuantityPurchased,
  } = useProductVariantDetails(
    product,
    selectedColor,
    selectedSizeVariants,
    quantityPurchased
  );

  // useEffect(() => {
  //   fetchAllCart(setCart, setSelectedSizes);
  // }, []);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultColor = selectedColorChoose || product.variants[0].color;
      if (selectedColorChoose && sizeChoose) {
        const selectedImage = product.productImages.find(
          (image) => image.color === selectedColorChoose
        );

        if (selectedImage) {
          setMainImage(selectedImage.filePath);
          setMainImageType(selectedImage);
        }

        // Find the matching variant for the selected color
        const selectedVariant = product.variants.find(
          (variant) => variant.color === selectedColorChoose
        );

        if (selectedVariant) {
          // Check if sizeChoose exists in the variant's sizes
          const matchingSizeIndex = selectedVariant.sizes.find(
            (size) => size.size === sizeChoose
          );

          if (matchingSizeIndex) {
            // Set the selected size variant to the matched size
            setSelectedSizeVariants(matchingSizeIndex.size);
            setQuantityPurchased(matchingSizeIndex.quantityPurchased || 0); // Set quantity if available
          }
        }
      } else {
        setMainImage(product?.productImages[0]?.filePath);
        setMainImageType(product?.productImages[0]);
        const defaultSizeVariant = product.variants.find(
          (variant) => variant.color === defaultColor
        )?.sizes[0]?.size;
        const defaultPurchasedVariant = product.variants.find(
          (variant) => variant.color === defaultColor
        )?.sizes[0]?.quantityPurchased;
        setSelectedSizeVariants(defaultSizeVariant || "");
        setQuantityPurchased(defaultPurchasedVariant || "");
      }
      setSelectedColor(defaultColor);
      setHoveredColor(defaultColor);
    }
  }, [product.variants, selectedColorChoose, sizeChoose, product]);

  const handleImageHover = (imageUrl, color, variantColor) => {
    setMainImage(imageUrl);
    setMainImageType(imageUrl);
    setHoveredColor(color);
    setSelectedColor(color);

    if (variantColor) {
      if (variantColor.trim().toLowerCase() === color.trim().toLowerCase()) {
        setSelectedColor(variantColor);
        const availableSizes = getSizeOptions(product.variants, variantColor);
        if (availableSizes.length > 0) {
          setSelectedSizeVariants(availableSizes[0].size);
          setQuantityPurchased(availableSizes[0].quantityPurchased || "");
        }
      }
    }
  };

  const addToCartVariant = async () => {
    const selectedVariant = getVariantDetails(
      product.variants,
      selectedColor,
      selectedSizeVariants
    );
    if (!selectedVariant.size) {
      alert("Please select a valid size and color");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await handleVariantAddToCart(
      product,
      cart,
      setCart,
      selectedSizeVariants,
      setSelectedSizes,
      selectedColor,
      cartVariantQuantity,
      variantPrice,
      variantMrpPrice
    );
    setIsProcessing(false);
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
    setMainImageType(imageUrl);
  };

  const variantDiscount = calculateDiscountPercentage(
    variantMrpPrice
      ? variantMrpPrice
      : product.variants.sizes
      ? product.variants[0].sizes[0].mrpPrice
      : 0,
    variantPrice
      ? variantPrice
      : product.variants.sizes
      ? product.variants[0].sizes[0].price
      : 0
  );

  const isLimitedTimeDeal = variantDiscount > 75;

  product.defaultSize =
    product.size && product.size.length > 0 ? product.size[0] : 0;

  const handleGoToCart = () => {
    navigate("/cart-page");
  };

  const handleImageHoverWrapper = (image, variants) => {
    if (variants && variants.length > 0) {
      // Update the image and color
      handleImageHover(image?.filePath, image?.color, variants[0]?.color);

      // Set the selected color
      setSelectedColor(image.color);

      // Automatically set the size to the first available size for the new color
      const availableSizes = getSizeOptions(product.variants, image.color);
      if (availableSizes.length > 0) {
        setSelectedSizeVariants(availableSizes[0].size); // Set the first size by default
        setQuantityPurchased(availableSizes[0].quantityPurchased || "");
      }
    } else {
      handleImageHover(image.filePath, image.color, null);
    }
  };

  const normalizedColor = hoveredColor ? hoveredColor.trim().toLowerCase() : "";

  const backgroundColor = normalizedColor === "white" ? "black" : "transparent";

  const variantCartItem = findVariantCartItem(
    cart,
    product._id,
    selectedColor,
    selectedSizeVariants
  );

  const variantCartQuantity = variantCartItem
    ? variantCartItem.variantQuantity
    : 0;

  // Ensure variantCartItem exists and has a variant object
  const isVariantCartQuantityMaxed = variantCartItem?.variant?.quantity
    ? variantCartQuantity >= variantCartItem.variant.quantity
    : false;
  const uniqueColors = [
    ...new Map(
      product.productImages.map((img) => [img?.color.trim().toLowerCase(), img])
    ).values(),
  ];

  const handleProceedToPayClick = () => {
    if (!userEmail) {
      // If there is no userEmail, show an alert and navigate to the login page
      alert("Please log in to proceed to payment.");
      navigate("/login"); // Redirect to the login page
      return; // Exit the function early
    }

    // Navigate to ProceedToPay page with the necessary state
    navigate("/proceedToPay", {
      state: {
        SubTotal,
        finalAmount: finalAmountToPay,
        Tax,
        initialCart: cart,
        size: selectedSizes,
      },
    });
  };

  return (
    <>
      {isVisible && (
        <div className="product-detail">
          <>
            {isProcessing && (
              <div className="overlay">
                <div className="processing-modal">
                  <div className="spinner"></div>
                  <p>
                    <span className="processing">Item adding</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </p>
                </div>
              </div>
            )}

            <div className="thumbnail-container-set main-image-container">
              {product.productImages &&
                product.productImages.length > 0 &&
                product?.productImages
                  ?.filter(
                    (img) =>
                      img?.color.trim().toLowerCase() ===
                      hoveredColor.trim().toLowerCase()
                  )
                  .map((image, index) => {
                    const isVideo = image?.type?.startsWith("video");
                    return !isVideo ? (
                      <img
                        key={`${index}`}
                        src={image.filePath || null}
                        alt={`${product.productName} thumbnail ${index}`}
                        className={`thumbnail ${
                          mainImage === image.filePath ? "selected" : ""
                        }`}
                        onMouseEnter={() =>
                          handleImageHoverWrapper(image, product.variants)
                        }
                        onClick={() => handleImageClick(image.filePath)}
                      />
                    ) : (
                      <video
                        key={`${index}`}
                        src={image.filePath}
                        alt={`${product.productName} thumbnail ${index}`}
                        className={`thumbnail ${
                          mainImage === image.filePath ? "selected" : ""
                        }`}
                        onMouseEnter={() =>
                          handleImageHoverWrapper(image, product.variants)
                        }
                        onClick={() => handleImageClick(image.filePath)}
                        title="Video"
                      />
                    );
                  })}
            </div>
            <div className="image-gallery-main">
              <div
                className="main-image"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => handleZoomToggle(true)}
                onMouseLeave={() => handleZoomToggle(false)}
              >
                {mainImage && mainImageType?.type?.startsWith("video") ? (
                  <video
                    src={mainImage || null}
                    controls // Enables play/pause and other video controls
                    alt={product.productName}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <img src={mainImage} alt={product.productName} />
                )}
                {isZoomed && !mainImageType?.type?.startsWith("video") && (
                  <img
                    src={mainImage || null}
                    alt={product.productName}
                    className="zoom-image zoomed-area"
                    style={{
                      transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%) scale(2)`,
                    }}
                  />
                )}
                <p
                  className="share-button"
                  title="Share"
                  // onClick={handleShareClick(product)}
                >
                  <FaShareAlt />
                </p>
              </div>
            </div>

            <div className="product-info">
              <h1>{product.productName}</h1>
              {cartVariantQuantity <= 0 && (
                <p>
                  <span className="limited-time-offer">
                    Currently unavailable for size {selectedSizeVariants}.
                  </span>
                  <br />
                  We don't know when or if this item will be back in stock.
                </p>
              )}
              {hoveredColor && (
                <p>
                  <strong>
                    Colour :{" "}
                    <span
                      style={{
                        color: hoveredColor,
                        backgroundColor: backgroundColor,
                      }}
                    >
                      {hoveredColor}
                    </span>
                  </strong>
                </p>
              )}
              <p>
                <Link to={`/search-results?query=${product.brandName}`}>
                  Brand: {product.brandName}
                </Link>
              </p>
              <p>{product.categoryName}</p>
              <p>{product.productDescription}</p>
              <span>
                <ProductPage productId={product._id} />
              </span>
              {cartVariantQuantity <= 0 && (
                <p>
                  <span style={{ color: "red" }}>Out of Stock</span>
                </p>
              )}
              {isLimitedTimeDeal && cartVariantQuantity > 0 && (
                <p className="limited-time-offer">Limited Time Deal</p>
              )}

              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "red", marginRight: "5px" }}>
                    {" "}
                    {variantDiscount}% off{" "}
                  </span>
                  <span className="a-price-symbol">₹</span>
                  <span style={{ fontWeight: "bold", fontSize: "28px" }}>
                    {variantPrice
                      ? variantPrice
                      : product.variants.sizes &&
                        product.variants[0].sizes[0].price}{" "}
                  </span>
                  <span className="a-price-fraction">
                    {QuantityPurchased && QuantityPurchased}
                  </span>{" "}
                </div>
                <p style={{ textDecoration: "line-through" }}>
                  MRP: ₹
                  {variantMrpPrice
                    ? variantMrpPrice
                    : product.variants.sizes &&
                      product.variants[0].sizes[0].mrpPrice}
                </p>
                <div>
                  <strong>
                    Colour:{" "}
                    <select
                      style={{
                        color: hoveredColor,
                        backgroundColor: backgroundColor,
                        width: "auto",
                        fontSize: "10px",
                      }}
                      value={selectedColor}
                      onChange={(e) => {
                        const selectedColorValue = e.target.value;
                        setSelectedColor(selectedColorValue);

                        // Automatically set the size to the first available size when the color changes
                        const availableSizes = getSizeOptions(
                          product.variants,
                          selectedColorValue
                        );
                        if (availableSizes.length > 0) {
                          setSelectedSizeVariants(availableSizes[0].size); // Set first size by default
                          setQuantityPurchased(
                            availableSizes[0].quantityPurchased || ""
                          );
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select Color
                      </option>
                      {product.variants &&
                        product.variants?.map((variant, index) => (
                          <option key={index} value={variant.color}>
                            {variant.color}
                          </option>
                        ))}
                    </select>
                  </strong>
                </div>
                <div>
                  <label>
                    Size:{" "}
                    <select
                      value={selectedSizeVariants}
                      onChange={(e) => setSelectedSizeVariants(e.target.value)}
                      style={{ width: "auto", fontSize: "10px" }}
                    >
                      <option value="">Select Size</option>
                      {getSizeOptions(product.variants, selectedColor).map(
                        (size, index) => (
                          <option key={index} value={size.size}>
                            {size.size}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                </div>
              </>
              {/* today end */}
              <div className="image-gallery">
                <div className="thumbnail-container">
                  {uniqueColors &&
                    uniqueColors?.map((image, index) => {
                      const isVideo =
                        image?.filePath?.startsWith("data:video/");

                      return !isVideo ? (
                        <img
                          key={`${index}`}
                          src={image?.filePath || null}
                          alt={`${product.productName} thumbnail ${index}`}
                          className={`thumbnail ${
                            selectedColor === image?.color ||
                            mainImage === image?.filePath ||
                            (mainImage === product.productImages[0]?.filePath &&
                              index === 0)
                              ? "selected"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            handleImageHoverWrapper(image, product.variants)
                          }
                          onClick={() => handleImageClick(image.filePath)}
                        />
                      ) : (
                        <video
                          key={`${index}`}
                          src={image.filePath}
                          alt={`${product.productName} thumbnail ${index}`}
                          className={`thumbnail ${
                            selectedColor === image?.color ||
                            mainImage === image.filePath
                              ? "selected"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            handleImageHoverWrapper(image, product.variants)
                          }
                          onClick={() => handleImageClick(image.filePath)}
                          title="Video"
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </>

          <div className="action-buttons">
            {cartVariantQuantity <= 0 && (
              <p>
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Currently unavailable.
                </span>
                <br />
                We don't know when or if this item will be back in stock.
              </p>
            )}

            <div className="cart-quantity-controls">
              <FaMinus
                className={
                  variantCartQuantity > 0
                    ? "cart-quantity-button minus"
                    : "cart-quantity-button minus disabled"
                }
                onClick={() =>
                  variantCartQuantity > 0 &&
                  handleRemoveFromCart2Variant(
                    product,
                    cart,
                    setCart,
                    selectedSizeVariants,
                    setSelectedSizes,
                    selectedColor,
                    setIsProcessing
                  )
                }
              />
              <div
                className="cart-quantity-display"
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {variantCartQuantity}
              </div>
              <FaPlus
                className="cart-quantity-button plus"
                disabled={cartVariantQuantity <= 0}
                onClick={() => {
                  if (!isVariantCartQuantityMaxed && cartVariantQuantity > 0) {
                    addToCartVariant();
                  }
                }}
                style={{
                  cursor:
                    isVariantCartQuantityMaxed || cartVariantQuantity <= 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isVariantCartQuantityMaxed || cartVariantQuantity <= 0
                      ? 0.5
                      : 1,
                }}
                title={
                  isVariantCartQuantityMaxed
                    ? `This seller has only ${variantCartItem?.variant?.quantity} of these available. To see if more are available from another seller, go to the product detail page.`
                    : cartVariantQuantity <= 0
                    ? "Out of stock"
                    : "Add to Cart"
                }
              />
            </div>

            {variantCartQuantity > 0 && (
              <button className="go-to-cart-button" onClick={handleGoToCart}>
                Go to Cart
              </button>
            )}
            {variantCartQuantity > 0 && (
              <button onClick={handleProceedToPayClick}>Proceed to Pay</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailID;
