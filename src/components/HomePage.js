import React, { useState, useEffect, useRef } from "react";
import { FaMinus, FaBan } from "react-icons/fa";
import "../css/home.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductPage from "./RatingProduct/ProductPage";
import LZString from "lz-string";

import {
  handleVariantAddToCart,
  handleRemoveFromCart2Variant,
  // fetchAllCart,
  renderShareOptions,
  renderColorOptions,
} from "./cartFunctions";
// import logo from "../icons/gow.jpg";
// import ChatBox from "./ChatBox";
import { Link } from "react-router-dom";
// import Product from "./Product.js";
import {
  // handleImageHover,
  // handleSizeChange,
  getVariantDetails,
  calculateDiscountPercentage,
  // useProductVariantDetails,
  getSizeOptions,
  updateVariantDetails,
  setVariantAll,
  useImageZoom,
} from "./VariantReusable.js";
import axiosInstance from "./axiosInstance.js";
import { useCart } from "./CartContext.js";
import FeedbackForm from "./FeedbackForm.js";

const HomePage = () => {
  const imgRef = useRef();
  const resultRef = useRef();
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const { handleImageLoad } = useImageZoom(imgRef, resultRef, setCx, setCy);
  const { cart, setCart, selectedSizeVariants, setSelectedSizeVariants } =
    useCart();

  const [products, setProducts] = useState([]);

  // const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(null);

  const [selectedColors, setSelectedColors] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // const [selectedSizeVariants, setSelectedSizeVariants] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const initialize = async () => {
      await fetchAllProducts();
      await setVariantAll(products, setSelectedOptions); // Await the async call
      // await fetchAllCart(setCart, setSelectedSizeVariants);

      const userIds = localStorage.getItem("userId");
      if (userIds) {
        setUserId(userIds);
      } else {
        try {
          const storedCart = JSON.parse(localStorage.getItem("carts")) || [];
          setCart(storedCart);
        } catch (error) {
          console.error(
            "Invalid cart data in localStorage, clearing data.",
            error
          );
          setCx(cx);
          setCy(cy);
          localStorage.removeItem("cart");
          setCart([]);
        }
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCart]); // Use an empty dependency array to ensure it runs only once

  useEffect(() => {
    if (cart.length > 0 && !userId) {
      const compressedCart = LZString.compress(JSON.stringify(cart));
      localStorage.setItem("cart", compressedCart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  // Updating selectedColor and selectedSizeVariants
  useEffect(() => {
    if (selectedColors || selectedSizeVariants) {
      if (selectedProduct) {
        updateVariantDetails(
          selectedProduct,
          selectedOptions,
          setSelectedOptions
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors, selectedSizeVariants]);

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get("product/getAllProducts");
      console.log("Getall", response);
      if (response.status !== 200) {
        toast.error(
          `Failed to fetch products. Server responded with status ${response.status}.`
        );
        console.error(`Error: Server responded with status ${response.status}`);
        return;
      }

      const updatedProducts = response.data.reverse();
      // setProducts((prevProducts) => [...prevProducts, ...updatedProducts]);
      setProducts(updatedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Server-side error. Please try again later.");
    }
  };

  const handleColorChange = (productId, color) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: {
        ...prevOptions[productId],
        color,
      },
    }));

    const selectedSizeVariants =
      getSizeOptions(findProductById(productId).variants, color)?.[0]?.size ||
      "";
    handleSizeChange(productId, selectedSizeVariants);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: {
        ...prevOptions[productId],
        size,
      },
    }));

    const product = findProductById(productId);
    updateVariantDetails(product, selectedOptions, setSelectedOptions);
  };

  const findProductById = (productId) => {
    return products.find((product) => product._id === productId);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const findCartItem = (productId) => {
    return cart.find((item) => item._id === productId);
  };

  const handleColorSelect = (productId, color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [productId]: color,
    }));
  };

  const isProductInCart = (product) => {
    return cart.some((item) => item._id === product._id);
  };

  const getProductQuantity = (product, selectedColor, selectedSize) => {
    const cartItem = cart.find(
      (item) =>
        item._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSizes === selectedSize
    );
    return cartItem ? cartItem.variantQuantity : "";
  };

  const fetchProductDetails = (selectedProduct) => {
    console.log("Selected Product:", selectedProduct);
    setSelectedProduct(selectedProduct);
  };

  const addToCartVariant = async (
    product,
    selectedColor,
    selectedSizeVariants,
    cartVariantQuantity,
    variantPrice,
    variantMrpPrice,
    selectedVariant
  ) => {
    console.log("selectedSizeVariants", selectedVariant);
    if (!selectedVariant.size) {
      alert("Please select a valid size and color");
      return;
    }

    setIsProcessing(true);
    // await new Promise((resolve) => setTimeout(resolve, 200));
    await handleVariantAddToCart(
      product,
      cart,
      setCart,
      selectedSizeVariants,
      setSelectedSizeVariants,
      selectedColor,
      cartVariantQuantity,
      variantPrice,
      variantMrpPrice
    );
    setIsProcessing(false);
  };

  const renderProductList = (categoryNames, products) => {
    return (
      <div className="row">
        {/* {products
          .filter(
            (prod) => categoryName === "" || prod.categoryName === categoryName
          ) */}
        {products
          .filter(
            (prod) =>
              categoryNames.length === 0 ||
              categoryNames.includes(prod.categoryName)
          )
          .map((prod, index) => {
            const cartItem = findCartItem(prod._id);
            const isProductInCarts = !!cartItem;
            const isCartQuantityMaxed =
              isProductInCarts &&
              cartItem.variantQuantity === cartItem.variant.quantity;

            const selectedOptionss = selectedOptions[prod._id] || {};
            const selectedColor =
              selectedOptionss.color || prod.variants?.[0].color;

            const selectedSizeVariants =
              selectedOptionss.size ||
              getSizeOptions(prod.variants, selectedColor)[0]?.size;

            const variantPrice =
              selectedOptionss.variantPrice ||
              prod.variants?.[0].sizes?.[0].price;

            const variantMrpPrice =
              selectedOptionss.variantMrpPrice ||
              prod.variants?.[0].sizes?.[0].mrpPrice;

            const cartVariantQuantity =
              selectedOptionss.cartVariantQuantity ||
              prod.variants?.[0].sizes?.[0].quantity;
            const variantDiscount = calculateDiscountPercentage(
              variantMrpPrice,
              variantPrice
            );
            const isLimitedTimeDeal = variantDiscount > 75;

            return (
              <div
                className="col-xl-3 col-md-6 col-lg-4 col-sm-6"
                key={`${prod._id}-${index}`}
              >
                <div className="product-wrap mb-25">
                  <div
                    className="product-img products-img"
                    style={{ userSelect: "" }}
                    onClick={() => handleProductClick(prod)}
                  >
                    <Link to={`/product?id=${prod._id}`} key={index}>
                      {prod?.productImages
                        ?.filter((image) =>
                          selectedColors[prod._id]
                            ? image.color === selectedColors[prod._id]
                            : true
                        )
                        .filter((image) => !image?.type?.startsWith("video"))
                        .map((image, imgIndex) => (
                          <img
                            className={
                              imgIndex === 0 ? "default-img" : "hover-img"
                            }
                            src={image.filePath}
                            alt={`Imagee ${index}-${imgIndex}`}
                            key={imgIndex}
                          />
                        ))}
                    </Link>
                    <span className="red">{variantDiscount}% off</span>

                    {/* Product actions */}
                    <div
                      className="product-action"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      {/* Wishlist, Cart, Quickview actions */}
                      <div
                        style={{ backgroundColor: "red" }}
                        className="pro-same-action pro-wishlist"
                        onClick={() => setSelectedProduct(prod)}
                      >
                        {renderShareOptions(
                          index,
                          prod,
                          showShareOptions,
                          handleShareButtonClick
                        )}
                      </div>
                      <div
                        className="pro-same-action pro-cart"
                        style={{ backgroundColor: "red" }}
                      >
                        {renderCartButton(
                          prod,
                          isCartQuantityMaxed,
                          selectedColor,
                          selectedSizeVariants,
                          cartVariantQuantity,
                          variantPrice,
                          variantMrpPrice
                        )}
                      </div>
                      <div
                        className="pro-same-action pro-quickview"
                        style={{ backgroundColor: "red" }}
                      >
                        <a
                          title="Quick View"
                          href="/#"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          <i className="pe-7s-look"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="product-content text-center">
                    <div>
                      <h5>{prod.subCategoryName}</h5>
                    </div>
                    <span className="product-brandName">
                      <a
                        style={{ color: "white" }}
                        href={`/search-results?query=${prod.brandName}`}
                      >
                        {prod.brandName}
                      </a>
                    </span>
                    <div>
                      <h3>
                        <Link to={`/product?id=${prod._id}`} key={index}>
                          {prod.productName}
                        </Link>
                      </h3>
                    </div>
                    <div className="">
                      <span
                        onClick={() =>
                          (window.location.href = `/product?id=${prod._id}`)
                        }
                      >
                        {/* (
                        {productRatings[prod._id] || "No rating yet"}{" "}
                        out of 5) */}

                        {/* {renderAverageStarRating(
                            productRatings[prod._id],
                            prod._id
                          )} */}
                        <ProductPage productId={prod._id} disabled={true} />
                      </span>
                      {isLimitedTimeDeal && (
                        <span className="limited-time-offer">
                          Limited Time Deal
                        </span>
                      )}
                    </div>
                    <div
                      className="product-price"
                      onClick={() =>
                        (window.location.href = `/product?id=${prod._id}`)
                      }
                    >
                      <span>₹ {variantPrice}</span>
                      <span className="old">M.R.P: ₹{variantMrpPrice}</span>
                    </div>
                    <div>
                      <span>
                        Colour:{" "}
                        <select
                          style={{
                            width: "auto",
                            fontSize: "10px",
                          }}
                          value={selectedColor}
                          onChange={(e) =>
                            handleColorChange(prod._id, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Select Color
                          </option>
                          {prod.variants &&
                            prod.variants?.map((variant, index) => (
                              <option key={index} value={variant.color}>
                                {variant.color}
                              </option>
                            ))}
                        </select>
                      </span>
                    </div>
                    <div>
                      Size:{" "}
                      <select
                        value={selectedSizeVariants}
                        onChange={(e) =>
                          handleSizeChange(prod._id, e.target.value)
                        }
                        style={{ width: "auto", fontSize: "10px" }}
                      >
                        <option value="">Select Size</option>
                        {getSizeOptions(prod.variants, selectedColor).map(
                          (size, index) => (
                            <option key={index} value={size.size}>
                              {size.size}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {renderColorOptions(
                      prod,
                      selectedImageIndex,
                      handleColorSelect,
                      setSelectedImageIndex
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderCartButton = (
    prod,
    isCartQuantityMaxed,
    selectedColor,
    selectedSizeVariants,
    cartVariantQuantity,
    variantPrice,
    variantMrpPrice
  ) => {
    // const cartItem = findCartItem(prod._id);
    const isInCart = isProductInCart(prod);
    const quantity = getProductQuantity(
      prod,
      selectedColor,
      selectedSizeVariants
    );
    const selectedVariant = getVariantDetails(
      prod.variants,
      selectedColor,
      selectedSizeVariants
    );

    return (
      <>
        {isInCart && quantity > 0 && (
          <FaMinus
            className="quantity-button minus"
            onClick={() =>
              handleRemoveFromCart2Variant(
                prod,
                cart,
                setCart,
                selectedSizeVariants,
                setSelectedSizeVariants,
                selectedColor,
                setIsProcessing
              )
            }
          />
        )}
        {isInCart && quantity ? (
          <button
            style={{
              backgroundColor: "red",
              fontSize: "14px",
              textAlign: "center",
              lineHeight: "1.8",
            }}
            onClick={() =>
              addToCartVariant(
                prod,
                selectedColor,
                selectedSizeVariants,
                cartVariantQuantity,
                variantPrice,
                variantMrpPrice,
                selectedVariant
              )
            }
            title={
              isCartQuantityMaxed
                ? `This seller has only ${cartVariantQuantity} of these available. To see if more are available from another seller, go to the product detail page.`
                : "Add To Cart"
            }
            disabled={cartVariantQuantity <= 0 || isCartQuantityMaxed}
          >
            <i className="pe-7s-cart"></i>
            {isCartQuantityMaxed
              ? `${quantity} Exceed`
              : `${quantity} Added In Cart`}
          </button>
        ) : (
          <button
            style={{
              backgroundColor: "red",
              userSelect: "none",
            }}
            onClick={() =>
              addToCartVariant(
                prod,
                selectedColor,
                selectedSizeVariants,
                cartVariantQuantity,
                variantPrice,
                variantMrpPrice,
                selectedVariant
              )
            }
            title={
              selectedVariant.quantity <= 0 ? "Out of Stock" : "Add To Cart"
            }
            disabled={selectedVariant.quantity <= 0}
          >
            {selectedVariant.quantity <= 0 ? (
              <>
                <FaBan style={{ marginRight: "5px" }} />
                Out of Stock
              </>
            ) : (
              <>
                <i className="pe-7s-cart"></i> Add to cart
              </>
            )}
          </button>
        )}
      </>
    );
  };

  const handleShareButtonClick = (index) => {
    setShowShareOptions((prevShowShareOptions) =>
      prevShowShareOptions === index ? -1 : index
    );
  };

  // const userEmail = localStorage.getItem("userEmail");
  // render()
  return (
    <>
      {loading ? (
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
        <div className="" style={{ userSelect: "", backgroundColor: "white" }}>
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
          {/* <ChatBox /> */}
          <header
            style={{
              position: "fixed",
              top: 70,
              left: 200,
              right: 0,
              backgroundColor: "transparent", // Optional: to set background color
              // zIndex: 1000,
              padding: "10px 0", // Optional: to add padding if needed
            }}
          ></header>

          <div
            style={{ backgroundColor: "white" }}
            className="product-area pb-60"
          >
            <div className="container">
              <div className="section-title text-center">
                {/* <h2>DAILY OFFERS DEALS!</h2> */}
              </div>
              <div className="product-tab-list nav pt-30 pb-55 text-center">
                <a href="#product-1" data-bs-toggle="tab">
                  <h4>Clothes</h4>
                </a>
                <a className="active" href="#product-2" data-bs-toggle="tab">
                  <h4>Friendship Day</h4>
                </a>
                <a href="#product-3" data-bs-toggle="tab">
                  <h4>Birthday Gifts</h4>
                </a>
                <a href="#product-4" data-bs-toggle="tab">
                  <h4>Anniversary Gifts</h4>
                </a>
                <a href="#product-5" data-bs-toggle="tab">
                  <h4>Women's Day</h4>
                </a>
                <a href="#product-6" data-bs-toggle="tab">
                  <h4>Mother's Day</h4>
                </a>
                <a href="#product-7" data-bs-toggle="tab">
                  <h4>Kid's</h4>
                </a>
              </div>
              <div className="tab-content jump">
                <div className="tab-pane" id="product-1">
                  {/* {renderProductList("Dresses", products)}
                  {renderProductList("Bottoms", products)} */}
                  {renderProductList(
                    ["Dresses", "Bottoms", "Tops", "Activewear"],
                    products
                  )}
                </div>

                <div className="tab-pane active" id="product-2">
                  {renderProductList("Friendship Day", products)}
                </div>
                <div className="tab-pane" id="product-3">
                  {renderProductList("Birthday Gifts", products)}
                </div>
                <div className="tab-pane" id="product-4">
                  {renderProductList("Anniversary Gifts", products)}
                </div>
                <div className="tab-pane" id="product-5">
                  {renderProductList("Womens Day", products)}
                </div>
                <div className="tab-pane" id="product-6">
                  {renderProductList("Mothers Day", products)}
                </div>
                <div className="tab-pane" id="product-7">
                  {renderProductList("Kids", products)}
                </div>
              </div>
            </div>
          </div>

          <div className="blog-area pb-55">
            <div className="container">
              <div className="section-title text-center mb-55">
                <h2>Recently View</h2>
              </div>
              {renderProductList("", products)}
            </div>
          </div>
          <footer className="footer-area bg-gray pt-100 pb-70">
            <div className="container">
              <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="copyright mb-30">
                    <div className="footer-logo">
                      {/* <a href="/#">
                        <img
                          alt=""
                          src={logo}
                          style={{ width: "120px", height: "auto" }}
                        />
                      </a> */}
                      <div
                        className="logo-container"
                        style={{ userSelect: "none", textDecoration: "none" }}
                      >
                        <a href="/#" className="gow-logo">
                          <span className="gow-main">GOW</span>
                          <span className="gow-full">Galaxy of Wishes</span>
                        </a>
                      </div>
                    </div>
                    <p>
                      © 2024 <a href="/#">GOW</a>.<br /> All Rights Reserved
                    </p>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="footer-widget mb-30 ml-30">
                    <div className="footer-title">
                      <h3>ABOUT US</h3>
                    </div>
                    <div className="footer-list">
                      <ul>
                        <li>
                          <a href="/about">About us</a>
                        </li>
                        <li>
                          <a href="##">Store-location:Mumbai</a>
                        </li>
                        <li>
                          <a href="/#">Email: shahafrin30@gmail.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="footer-widget mb-30 ml-50">
                    {/* <div className="footer-title">
                      <h3>USEFUL LINKS</h3>
                    </div>
                    <div className="footer-list">
                      <ul>
                        <li>
                          <a href="/#">Returns</a>
                        </li>
                        <li>
                          <a href="/#">Support Policy</a>
                        </li>
                        <li>
                          <a href="/#">Size guide</a>
                        </li>
                        <li>
                          <a href="/#">FAQs</a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-6">
                  <div className="footer-widget mb-30 ml-75">
                    <div className="footer-title">
                      <h3>FOLLOW US</h3>
                    </div>
                    <div className="footer-list">
                      <ul>
                        <li>
                          <a
                            className="fa fa-facebook"
                            href="https://www.facebook.com/ASHMI6oo7/"
                          >
                            &nbsp; Facebook
                          </a>
                        </li>
                        <li>
                          <a
                            className="fa fa-linkedin"
                            href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/"
                          >
                            &nbsp; linkedin
                          </a>
                        </li>
                        <li>
                          <a
                            className="fa fa-instagram"
                            href="https://www.instagram.com/ashwin_oo7/"
                          >
                            &nbsp; Instagram
                          </a>
                        </li>
                        <li>
                          <a
                            className="fa fa-youtube"
                            href="https://www.youtube.com/channel/UCXE9IrBDQDwf2If_S6XKKiw"
                          >
                            &nbsp; Youtube
                          </a>
                        </li>
                        <li>
                          <FeedbackForm />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="footer-widget mb-30 ml-70">
                    <div className="footer-title">
                      <h3>SUBSCRIBE</h3>
                    </div>
                    <div className="subscribe-style">
                      <p>
                        Get E-mail updates about our latest shop and special
                        offers.
                      </p>

                      <div id="mc_embed_signup" className="subscribe-form">
                        <form
                          id="mc-embedded-subscribe-form"
                          className="validate"
                          noValidate=""
                          target="_blank"
                          name="mc-embedded-subscribe-form"
                          method="post"
                          action="#"
                        >
                          <div id="mc_embed_signup_scroll" className="mc-form">
                            <input
                              className="email"
                              type="email"
                              required=""
                              placeholder="Enter your email here.."
                              name="EMAIL"
                              // value=""
                              defaultValue="" // Uncontrolled input
                            />
                            <div className="mc-news" aria-hidden="true">
                              <input
                                type="text"
                                // value=""
                                tabIndex="-1"
                                name="b_6bbb9b6f5827bd842d9640c82_05d85f18ef"
                                defaultValue="" // Uncontrolled input
                              />
                            </div>
                            <div className="clear">
                              <input
                                id="mc-embedded-subscribe"
                                className="button"
                                type="submit"
                                name="subscribe"
                                value="Subscribe"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {/* Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ maxWidth: "100%" }}>
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    title="close modal"
                  ></button>
                </div>
                {selectedProduct &&
                  (() => {
                    const productId = selectedProduct._id;
                    if (!productId) return null; // Early return if productId is not available

                    const cartItem = findCartItem(productId);
                    const isProductInCarts = !!cartItem;
                    const isCartQuantityMaxed =
                      isProductInCarts &&
                      cartItem.variantQuantity === cartItem.variant.quantity;
                    const selectedOptionss =
                      selectedOptions[selectedProduct._id] || {};
                    const selectedColor =
                      selectedOptionss.color ||
                      selectedProduct.variants?.[0].color; // Default to the first variant color

                    const selectedSizeVariants =
                      selectedOptionss.size ||
                      getSizeOptions(selectedProduct.variants, selectedColor)[0]
                        ?.size; // Default to the first size for the selected color

                    const variantPrice =
                      selectedOptionss.variantPrice ||
                      selectedProduct.variants?.[0].sizes?.[0].price;

                    const variantMrpPrice =
                      selectedOptionss.variantMrpPrice ||
                      selectedProduct.variants?.[0].sizes?.[0].mrpPrice;

                    const cartVariantQuantity =
                      selectedOptionss.cartVariantQuantity ||
                      selectedProduct.variants?.[0].sizes?.[0].quantity;
                    const selectedVariant = getVariantDetails(
                      selectedProduct.variants,
                      selectedColor,
                      selectedSizeVariants
                    );

                    return (
                      <div
                        className="modal-body"
                        onClick={() => fetchProductDetails(selectedProduct)}
                      >
                        <div className="row">
                          <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="tab-content quickview-big-img">
                              <div
                                id="pro-1"
                                className="tab-pane fade show active img-container"
                                onMouseEnter={() => {
                                  handleImageLoad(); // Reset the zoom functionality when mouse enters
                                  const result = resultRef.current;
                                  if (result) result.style.display = "block"; // Show zoom result
                                }}
                                onMouseLeave={() => {
                                  setCx(0); // Reset zoom factor on mouse leave
                                  setCy(0); // Reset zoom factor on mouse leave
                                  const lens =
                                    document.querySelector(".img-zoom-lens");
                                  if (lens) lens.style.display = "none";
                                  const result = resultRef.current;
                                  if (result) result.style.display = "none";
                                }}
                              >
                                <img
                                  title={`product-image : ${selectedProduct.productName}`}
                                  src={
                                    selectedProduct?.productImages[0]
                                      ?.filePath || ""
                                  }
                                  alt=""
                                  ref={imgRef}
                                />
                              </div>
                              {selectedProduct.productImages.map(
                                (image, index) => (
                                  <div
                                    key={`pro-${index}`}
                                    id={`pro-${index + 1}`}
                                    className={`tab-pane fade ${
                                      index === 1 ? "show active" : ""
                                    }`}
                                  >
                                    <img
                                      src={image.filePath}
                                      title={`product-image : ${selectedProduct.productDescription}`}
                                      alt=""
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {selectedProduct && (
                            <div
                              className="col-md-7 col-sm-12 col-xs-12"
                              onClick={() =>
                                fetchProductDetails(selectedProduct)
                              }
                            >
                              <div className="product-details-content quickview-content">
                                {/* {isHovered && ( */}
                                <div
                                  id="myresult"
                                  ref={resultRef}
                                  className="img-zoom-result"
                                ></div>
                                {/* )} */}
                                <h2>{selectedProduct.brandName}</h2>
                                <div className="product-details-price">
                                  <span>
                                    &#8377;
                                    {variantPrice}
                                  </span>
                                  <span className="old">
                                    &#8377;
                                    {variantMrpPrice}
                                  </span>
                                </div>
                                <div className="pro-details-rating-wrap">
                                  <div className="pro-details-rating">
                                    <ProductPage
                                      productId={selectedProduct._id}
                                      disabled={true}
                                    />
                                  </div>
                                  <span></span>
                                </div>
                                <p>
                                  {selectedProduct.categoryName}
                                  <br />
                                  {selectedProduct.subCategoryName}
                                  <br />
                                  {selectedProduct.productName}
                                  <br />
                                  <strong>
                                    {selectedProduct.productDescription}
                                  </strong>
                                  <br />
                                </p>
                                <div className="pro-details-list">
                                  <ul>
                                    <li>
                                      <div>
                                        <strong>
                                          Colour:{" "}
                                          <select
                                            style={{
                                              width: "auto",
                                              fontSize: "10px",
                                            }}
                                            value={selectedColor}
                                            onChange={(e) =>
                                              handleColorChange(
                                                selectedProduct._id,
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="" disabled>
                                              Select Color
                                            </option>
                                            {selectedProduct.variants &&
                                              selectedProduct.variants?.map(
                                                (variant, index) => (
                                                  <option
                                                    key={index}
                                                    value={variant.color}
                                                  >
                                                    {variant.color}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </strong>
                                      </div>

                                      <div>
                                        <h3>
                                          <select
                                            value={selectedSizeVariants}
                                            onChange={(e) =>
                                              handleSizeChange(
                                                selectedProduct._id,
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "auto",
                                              fontSize: "10px",
                                            }}
                                          >
                                            <option value="">
                                              Select Size
                                            </option>
                                            {getSizeOptions(
                                              selectedProduct.variants,
                                              selectedColor
                                            ).map((size, index) => (
                                              <option
                                                key={index}
                                                value={size.size}
                                              >
                                                {size.size}
                                              </option>
                                            ))}
                                          </select>
                                        </h3>
                                      </div>
                                      <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="support-wrap mb-30 support-2">
                                          <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                                            <div className="main-menu">
                                              <nav>
                                                <ul>
                                                  <li>
                                                    <div className="support-content">
                                                      <p>
                                                        <i className="fa fa-angle-down">
                                                          Size_guide
                                                        </i>
                                                      </p>
                                                    </div>
                                                    <ul
                                                      className="mega-menu"
                                                      style={{
                                                        width: "600px",
                                                      }}
                                                    >
                                                      {" "}
                                                      <div className="support-icon">
                                                        <img
                                                          className="animated"
                                                          src="assets/img/icon-img/clothe_size.jpg"
                                                          alt=""
                                                        />
                                                      </div>
                                                    </ul>
                                                  </li>
                                                </ul>
                                              </nav>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="pro-details-quality">
                                  <div
                                    className="pro-details-cart btn-hover"
                                    style={{}}
                                  >
                                    {isProductInCart(
                                      selectedProduct,
                                      selectedColor,
                                      selectedSizeVariants
                                    ) &&
                                    getProductQuantity(
                                      selectedProduct,
                                      selectedColor,
                                      selectedSizeVariants
                                    ) > 0 ? (
                                      <div
                                        className="remove-button-container"
                                        style={{
                                          marginLeft: "-25px",
                                          marginBottom: "-35px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <FaMinus
                                          style={{}}
                                          title="Remove"
                                          className="quantity-button minus"
                                          onClick={() =>
                                            handleRemoveFromCart2Variant(
                                              selectedProduct,
                                              cart,
                                              setCart,
                                              selectedSizeVariants,
                                              setSelectedSizeVariants,
                                              selectedColor,
                                              setIsProcessing
                                            )
                                          }
                                        />
                                      </div>
                                    ) : null}
                                    {isProductInCart(selectedProduct) ? (
                                      <button
                                        style={{
                                          backgroundColor: "blue",
                                          marginTop: "0px",
                                        }}
                                        onClick={() =>
                                          addToCartVariant(
                                            selectedProduct,
                                            selectedColor,
                                            selectedSizeVariants,
                                            cartVariantQuantity,
                                            variantPrice,
                                            variantMrpPrice,
                                            selectedVariant
                                          )
                                        }
                                        title={
                                          isCartQuantityMaxed
                                            ? `This seller has only ${cartVariantQuantity} of these available. To see if more are available from another seller, go to the product detail page.`
                                            : "Add To Cart"
                                        }
                                        disabled={
                                          cartVariantQuantity <= 0 ||
                                          isCartQuantityMaxed
                                        }
                                      >
                                        <i className="pe-7s-cart"></i>

                                        {isCartQuantityMaxed
                                          ? `${getProductQuantity(
                                              selectedProduct,
                                              selectedColor,
                                              selectedSizeVariants
                                            )} Exceed`
                                          : `${getProductQuantity(
                                              selectedProduct,
                                              selectedColor,
                                              selectedSizeVariants
                                            )} Added In Cart`}
                                      </button>
                                    ) : (
                                      <button
                                        style={{
                                          backgroundColor: "blue",
                                          marginTop: "0px",
                                        }}
                                        onClick={() =>
                                          addToCartVariant(
                                            selectedProduct,
                                            selectedColor,
                                            selectedSizeVariants,
                                            cartVariantQuantity,
                                            variantPrice,
                                            variantMrpPrice,
                                            selectedVariant
                                          )
                                        }
                                        title={
                                          cartVariantQuantity <= 0
                                            ? "Out of Stock"
                                            : "Add To Cart"
                                        }
                                        disabled={cartVariantQuantity <= 0}
                                      >
                                        {cartVariantQuantity <= 0 ? (
                                          <>
                                            <FaBan
                                              style={{ marginRight: "5px" }}
                                            />
                                            Out of Stock
                                          </>
                                        ) : (
                                          <>
                                            <i className="pe-7s-cart"></i> Add
                                            to cart
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                  <div style={{}}>
                                    <button
                                      style={{
                                        backgroundColor: "blue",
                                        marginTop: "-3px",
                                        borderRadius: "115px",
                                      }}
                                    >
                                      <a
                                        href="/cart-page"
                                        className="view-cart"
                                        style={{
                                          color: "white",
                                          textDecoration: "none",
                                        }}
                                      >
                                        View Cart
                                      </a>
                                    </button>
                                  </div>

                                  <div
                                    className="pro-details-wishlist"
                                    style={{ paddingLeft: "5px" }}
                                  >
                                    <a href="/#">
                                      <i className="fa fa-heart-o"></i>
                                    </a>
                                  </div>
                                  <div className="pro-details-compare">
                                    <a href="/#">
                                      <i className="pe-7s-shuffle"></i>
                                    </a>
                                  </div>
                                </div>

                                <div className="pro-details-social">
                                  <ul>
                                    <li>
                                      <a href="https://www.facebook.com/ASHMI6oo7/">
                                        <i className="fa fa-facebook"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="https://www.youtube.com/@ashwin0401">
                                        <i className="fa fa-youtube"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="/#">
                                        <i className="fa fa-twitter"></i>
                                      </a>
                                    </li>
                                    <br />
                                    <li>
                                      <a href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/">
                                        <i className="fa fa-linkedin"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default HomePage;
