/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import "../css/search.css";
import { filterLatestProducts } from "./cartFunctions";
import { parse } from "date-fns";
import ProductPage from "./RatingProduct/ProductPage";

import {
  // handleImageHover,
  // handleSizeChange,
  // getVariantDetails,
  calculateDiscountPercentage,
  // useDebouncedMouseMove,
  // useProductVariantDetails,
} from "./VariantReusable.js"; // Import reusable functions
const MAX_LENGTH = 50;
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const sortProducts = (products, sortOption, selectedColor) => {
  const sortByOptions = {
    // priceLowToHigh: (a, b) => a.productPrice - b.productPrice,
    // priceHighToLow: (a, b) => b.productPrice - a.productPrice,
    priceLowToHigh: (a, b) => {
      const colorA =
        (selectedColor[a._id] && selectedColor[a._id].toLowerCase()) ||
        (a.variants?.[0]?.color && a.variants[0].color.toLowerCase());

      const colorB =
        (selectedColor[b._id] && selectedColor[b._id].toLowerCase()) ||
        (b.variants?.[0]?.color && b.variants[0].color.toLowerCase());

      const priceA =
        a.variants?.find((variant) => variant?.color?.toLowerCase() === colorA)
          ?.sizes?.[0]?.price || 0;

      const priceB =
        b.variants?.find((variant) => variant?.color?.toLowerCase() === colorB)
          ?.sizes?.[0]?.price || 0;

      return priceA - priceB;
    },
    priceHighToLow: (a, b) => {
      const colorA =
        (selectedColor[a._id] && selectedColor[a._id].toLowerCase()) ||
        (a.variants?.[0]?.color && a.variants[0].color.toLowerCase());

      const colorB =
        (selectedColor[b._id] && selectedColor[b._id].toLowerCase()) ||
        (b.variants?.[0]?.color && b.variants[0].color.toLowerCase());

      const priceA =
        a.variants?.find((variant) => variant?.color?.toLowerCase() === colorA)
          ?.sizes?.[0]?.price || 0;

      const priceB =
        b.variants?.find((variant) => variant?.color?.toLowerCase() === colorB)
          ?.sizes?.[0]?.price || 0;

      return priceB - priceA;
    },

    NewestArrivals: (a, b) =>
      parse(b.created_at, "dd/MM/yyyy, h:mm:ss a", new Date()) -
      parse(a.created_at, "dd/MM/yyyy, h:mm:ss a", new Date()),
    ratingHighToLow: (a, b) =>
      (b?.averageRating || 0) - (a?.averageRating || 0),
    ratingLowToHigh: (a, b) =>
      (a?.averageRating || 0) - (b?.averageRating || 0),
    bestSellers: (a, b) =>
      (b?.QuantityPurchased || 0) - (a?.QuantityPurchased || 0),
  };
  return sortByOptions[sortOption]
    ? products.sort(sortByOptions[sortOption])
    : products;
};

const handleProductImages = (
  productId,
  setImageIndex,
  imageIndex,
  direction,
  Products,
  setSelectedColor
) => {
  const product = Products?.find((product) => product._id === productId);
  const maxIndex = product?.productImages?.length - 1 || 0;
  const currentIndex = imageIndex[productId] || 0;
  const newIndex =
    direction === "next"
      ? currentIndex === maxIndex
        ? 0
        : currentIndex + 1
      : currentIndex === 0
      ? maxIndex
      : currentIndex - 1;

  const currentImageColor =
    product?.productImages[newIndex]?.color?.toLowerCase();
  if (currentImageColor) {
    const matchingVariant = product?.variants?.find(
      (variant) => variant.color?.toLowerCase() === currentImageColor
    );
    if (matchingVariant) {
      setSelectedColor((prev) => ({
        ...prev,
        [productId]: matchingVariant.color,
      }));
    }
  }

  setImageIndex((prevIndex) => ({ ...prevIndex, [productId]: newIndex }));
};

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [imageIndex, setImageIndex] = useState({});
  const [noResults, setNoResults] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [selectedColor, setSelectedColor] = useState({});

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query.toLowerCase().trim());
    } else {
      window.location = "/";
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    if (!query) return;

    // Split the query into words (e.g., ["adidas", "orange", "tshirt"])
    const queryParts = query.toLowerCase().split(" ");

    // Fields to search through
    const searchFields = [
      "_id",
      "categoryName",
      "subCategoryName",
      "brandName",
      "productName",
      "productQuantity",
      "productPrice",
      "productMrpPrice",
      "manufacturer",
    ];

    const results = allProducts.filter((prod) => {
      const matchesSimpleFields = searchFields.some((field) => {
        const fieldValue = prod[field];

        if (typeof fieldValue === "number") {
          // Convert numbers to string for comparison
          return queryParts.some((part) =>
            fieldValue.toString().toLowerCase().includes(part)
          );
        } else if (typeof fieldValue === "string") {
          // For string fields
          return queryParts.some((part) =>
            fieldValue.toLowerCase().includes(part)
          );
        }
        return false;
      });

      // Check for matches in product images' color field
      const matchesProductImages = prod.productImages?.some((image) => {
        if (image.color && typeof image.color === "string") {
          return queryParts.some((part) =>
            image.color.toLowerCase().includes(part)
          );
        }
        return false;
      });

      // Exact match across brandName, subCategoryName, and productImages.color
      const exactMatch = queryParts.every(
        (part) =>
          searchFields.some((field) =>
            prod[field]?.toString().toLowerCase().includes(part)
          ) ||
          prod.productImages?.some((image) =>
            image.color?.toLowerCase().includes(part)
          )
      );

      // Handle 'latest' query for fetching latest products
      if (query === "latest") {
        return filterLatestProducts([prod]).length > 0;
      }

      // Return products that either match exactly or partially
      return exactMatch || matchesSimpleFields || matchesProductImages;
    });

    if (results.length === 0) {
      setNoResults(true);
      fetchRelatedProducts(query);
    } else {
      setFilteredProducts(results);
      setNoResults(false);
    }
  };
  //
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const fetchRelatedProducts = (query) => {
    const getRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const searchFields = [
      "_id",
      "categoryName",
      "subCategoryName",
      "brandName",
      "productName",
      "productQuantity",
      "productPrice",
      "productMrpPrice",
      "manufacturer",
    ];

    const related = allProducts.filter((prod) => {
      return searchFields.some((field) => {
        return prod[field]
          ?.toString()
          .toLowerCase()
          .includes((query || "").toLowerCase());
      });
    });
    const relateds = allProducts?.filter((prod) => {
      return Object.values(prod).some((value) =>
        value
          ?.toString()
          .toLowerCase()
          .includes((query || "").toLowerCase())
      );
    });

    const randomCount =
      related.length > 0
        ? getRandomNumber(5, related.length)
        : getRandomNumber(5, allProducts.length);

    setRelatedProducts(
      ((related || relateds).length > 0 ? related || relateds : allProducts)
        .sort(() => 0.5 - Math.random())
        .slice(0, randomCount)
    );
  };

  relatedProducts && sortProducts(relatedProducts, sortOption, selectedColor);
  filteredProducts && sortProducts(filteredProducts, sortOption, selectedColor);

  console.log("sort", relatedProducts, "filteredProducts", filteredProducts);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true); // Ensure this is before fetching
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `product/getAllProducts`
        );
        if (response.data) {
          console.log("Searched product", response.data);
          setAllProducts(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && searchQuery) {
      handleSearch(searchQuery);
    }
  }, [allProducts, searchQuery, sortOption]);

  // useEffect(() => {
  //   if (filteredProducts.length > 0) {
  //     setFilteredProducts(sortProducts([...filteredProducts], sortOption));
  //   } else if (relatedProducts.length > 0) {
  //     setRelatedProducts(sortProducts([...relatedProducts], sortOption));
  //   }
  // }, [sortOption, filteredProducts, relatedProducts]);

  const productList = (products) => (
    <div className="product-item-list">
      {products?.map((product, index) => {
        const currentColor =
          selectedColor[product._id] || product?.variants?.[0]?.color;
        const selectedVariant = product?.variants?.find(
          (variant) =>
            variant.color.toLowerCase() === currentColor.toLowerCase()
        );

        const price = selectedVariant?.sizes?.[0]?.price || 0;
        const mrpPrice = selectedVariant?.sizes?.[0]?.mrpPrice || 0;
        const discountPercentage = calculateDiscountPercentage(
          mrpPrice || 0,
          price || 0
        );

        /* const discountPercentage = calculateDiscountPercentage(
          mrpPrice || product.variants?.[0]?.sizes?.[0]?.mrpPrice || 0,
          price || product.variants?.[0]?.sizes?.[0]?.price || 0
        ); */

        // Check if the discount is more than 50%
        const isLimitedTimeDeal = discountPercentage > 75;

        return (
          <div key={product._id} className="product-item">
            <div className="carousel-container">
              {product.productImages.length > 1 && (
                <span
                  className="carousel-arrow left"
                  onClick={() =>
                    handleProductImages(
                      product._id,
                      setImageIndex,
                      imageIndex,
                      "prev",
                      products,
                      setSelectedColor
                    )
                  }
                >
                  &lt;
                </span>
              )}

              <div className="product-images-container">
                <img
                  // className="product-image"
                  src={
                    product.productImages[imageIndex[product._id] || 0]?.filePath
                  }
                  alt={product.productName}
                  onClick={() => {
                    const selectedColor =
                      product.productImages[imageIndex[product._id] || 0]
                        ?.color;

                    const matchingVariant = product.variants.find(
                      (variant) =>
                        variant.color.toLowerCase() ===
                        selectedColor.toLowerCase()
                    );
                    const selectedSize =
                      matchingVariant?.sizes?.[0]?.size || "Unknown Size";
                    window.location.href = `/product?id=${product._id}&color=${selectedColor}&size=${selectedSize}`;
                  }}
                />
              </div>
              {product.productImages.length > 1 && (
                <span
                  className="carousel-arrow right"
                  onClick={() =>
                    handleProductImages(
                      product._id,
                      setImageIndex,
                      imageIndex,
                      "next",
                      products,
                      setSelectedColor
                    )
                  }
                >
                  &gt;
                </span>
              )}
            </div>
            <span>{product.brandName}</span>
            <span
              onClick={() =>
                (window.location.href = `/product?id=${product._id}`)
              }
            >
              <ProductPage productId={product._id} disabled={true} />
            </span>
            {isLimitedTimeDeal && (
              <span className="limited-time-deal">Limited Time Deal</span>
            )}
            <h3
              onClick={() =>
                (window.location.href = `/product?id=${product._id}`)
              }
              className="product-name"
            >
              {truncateText(product.productName, MAX_LENGTH)}
            </h3>
            <p>
              <span style={{ color: "red" }}>
                {/* ({Math.round(product.discount)}% off) */}
                {/* {calculateDiscountPercentage(
                  mrpPrice || product.variants?.[0]?.sizes?.[0]?.mrpPrice || 0,
                  price || product.variants?.[0]?.sizes?.[0]?.price || 0
                )} */}
                {discountPercentage}% off
              </span>
              {"  "}
              {/* <span>₹{product.productPrice}</span> */}
              <span>
                {" "}
                {price || 0}
                {/* {price || product.variants[0]?.sizes[0]?.price || 0} */}
              </span>
            </p>
            <p
              style={{
                fontSize: "10px",
                textDecoration: "line-through",
              }}
            >
              {/* M.R.P: ₹{product.productMrpPrice} */}
              MRP: ₹{mrpPrice || 0}
              {/* {mrpPrice || product.variants[0]?.sizes[0]?.mrpPrice || 0} */}
            </p>
            <Link to={`/product?id=${product._id}`} key={index}>
              View Product
            </Link>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-results-page">
      <div className="sort-title-container">
        <div className="sort-options">
          {/* <p className="labelsssssssss" htmlFor="sort">
            Sort_by:{" "}
          </p> */}
          <select
            className="small-screen-select"
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="NewestArrivals">Newest Arrivals</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
            <option value="ratingLowToHigh">Rating: Low to High</option>
            <option value="bestSellers">Best Sellers</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <h2 className="results-count">
          <>
            {noResults
              ? `${relatedProducts.length.toLocaleString()}`
              : `${filteredProducts?.length.toLocaleString()}`}{" "}
            {noResults ? "Related Results for" : "Search Results for"}{" "}
            <span
              className="extra-small-screen-scroll"
              style={{ color: "red" }}
            >
              "{searchQuery}"
            </span>
          </>
        </h2>
      </div>

      {noResults ? (
        <div className="no-results">{productList(relatedProducts)}</div>
      ) : (
        <div className="no-results">{productList(filteredProducts)}</div>
      )}
      {/* <div className="no-results">
        <strong>Recommended based on your browsing history</strong>{" "}
        {productList(allProducts)}
      </div> */}
    </div>
  );
}
