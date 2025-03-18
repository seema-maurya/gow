import React from "react";

const ProductActions = ({
  product,
  renderShareOptions,
  renderCartButton,
  isCartQuantityMaxed,
}) => {
  return (
    <div className="product-action">
      <div
        style={{ backgroundColor: "red" }}
        className="pro-same-action pro-wishlist"
      >
        {renderShareOptions(product._id, product)}
      </div>
      <div
        className="pro-same-action pro-cart"
        style={{ backgroundColor: "red" }}
      >
        {renderCartButton(product, isCartQuantityMaxed)}
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
  );
};

export default ProductActions;
