import React from "react";
import { Link } from "react-router-dom";

const ProductDetails = ({
  product,
  selectedSizes,
  getDefaultSize,
  handleSizeChange,
  handleProductClick,
  renderAverageStarRating,
  productRatings,
  renderColorOptions,
}) => {
  return (
    <div className="product-content text-center">
      <div>
        <h5>{product.subCategoryName}</h5>
      </div>
      <strong style={{ backgroundColor: "red" }}>
        <a style={{ color: "white", fontSize: "20px" }} href="##">
          {product.brandName}
        </a>
      </strong>
      <div>
        <h3>
          <Link to={`/product?id=${product._id}`}>{product.productName}</Link>
        </h3>
      </div>
      <div>
        <select
          className="select-size"
          title="select size"
          value={selectedSizes[product._id] || getDefaultSize(product)}
          onChange={(e) => handleSizeChange(product._id, e)}
          style={{ width: "auto" }}
        >
          <option value="">Select Size</option>
          {product.size.map((sizeOption, sizeIndex) => (
            <option key={sizeIndex} value={sizeOption}>
              {sizeOption}
            </option>
          ))}
        </select>
      </div>
      {renderColorOptions(product)}
      <div className="product-rating" onClick={handleProductClick}>
        <span>
          {productRatings[product._id] || "No rating yet"} out of 5
          <div>
            {renderAverageStarRating(productRatings[product._id], product._id)}
          </div>
        </span>
      </div>
      <div className="product-price">
        <span>₹ {product.productPrice}</span>
        <span className="old">₹ {product.productMrpPrice}</span>
      </div>
    </div>
  );
};

export default ProductDetails;
