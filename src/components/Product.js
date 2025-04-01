import React from "react";
import { Link } from "react-router-dom";

const Product = ({
  categoryName,
  products,
  handleProductClick,
  findCartItem,
  renderShareOptions,
  renderCartButton,
  renderColorOptions,
  getProductSelectedSizes,
  handleSizeChange,
  renderAverageStarRating,
  productRatings, // Pass this as a prop
  selectedColors, // Pass this as a prop
}) => {
  return (
    <div className="row">
      {products
        .filter(
          (prod) => categoryName === "" || prod.categoryName === categoryName
        )
        .map((prod, index) => {
          const cartItem = findCartItem(prod._id);
          const isProductInCart = !!cartItem;
          const isCartQuantityMaxed =
            isProductInCart && cartItem.productQuantity === cartItem.quantity;

          return (
            <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={prod._id}>
              <div className="product-wrap mb-25">
                <div
                  className="product-img products-img"
                  style={{ userSelect: "none" }}
                  onClick={() => handleProductClick(prod)}
                >
                  <Link to={`/product/${prod._id}`} key={index}>
                    {prod.productImages
                      .filter((image) =>
                        selectedColors[prod._id]
                          ? image.color === selectedColors[prod._id]
                          : true
                      )
                      .map((image, imgIndex) => (
                        <img
                          className={
                            imgIndex === 0 ? "default-img" : "hover-img"
                          }
                          src={image.dataURL}
                          alt={`Imagee ${index}-${imgIndex}`}
                          key={imgIndex}
                        />
                      ))}
                  </Link>
                  <span className="red">{prod.discount}</span>

                  {/* Product actions */}
                  <div
                    className="product-action"
                    onClick={() => handleProductClick(prod)}
                  >
                    {/* Wishlist, Cart, Quickview actions */}
                    <div
                      style={{ backgroundColor: "red" }}
                      className="pro-same-action pro-wishlist"
                      onClick={() => handleProductClick(prod)}
                    >
                      {renderShareOptions(index, prod)}
                    </div>
                    <div
                      className="pro-same-action pro-cart"
                      style={{ backgroundColor: "red" }}
                    >
                      {renderCartButton(prod, isCartQuantityMaxed)}
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
                  <strong style={{ backgroundColor: "red" }}>
                    <a
                      style={{
                        color: "white",
                        fontSize: "20px",
                      }}
                      href="##"
                    >
                      {prod.brandName}
                    </a>
                  </strong>
                  <div>
                    <h3>
                      <Link to={`/product/${prod._id}`}>
                        {prod.productName}
                      </Link>
                    </h3>
                  </div>
                  <div>
                    <h3>
                      <select
                        value={getProductSelectedSizes(prod) || ""}
                        onChange={(e) => handleSizeChange(prod._id, e)}
                        style={{ width: "auto" }}
                      >
                        <option value="">Select Size</option>
                        {prod.size.map((sizeOption, sizeIndex) => (
                          <option key={sizeIndex} value={sizeOption}>
                            {sizeOption}
                          </option>
                        ))}
                      </select>
                    </h3>
                  </div>
                  {renderColorOptions(prod)}
                  <div
                    className="product-rating"
                    onClick={() => handleProductClick(prod)}
                  >
                    <span>
                      ({productRatings[prod._id] || "No rating yet"} out of 5)
                      <div>
                        {renderAverageStarRating(
                          productRatings[prod._id],
                          prod._id
                        )}
                      </div>
                    </span>
                  </div>
                  <div className="product-price">
                    <span>₹ {prod.productPrice}</span>
                    <span className="old">₹ {prod.productMrpPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Product;
