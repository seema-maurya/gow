import React from "react";
import { Link } from "react-router-dom";

const ProductImageGallery = ({
  product,
  selectedColor,
  handleProductClick,
}) => {
  const filteredImages = product.productImages.filter((image) =>
    selectedColor ? image.color === selectedColor : true
  );

  return (
    <div
      className="product-img products-img"
      style={{ userSelect: "none" }}
      onClick={handleProductClick}
    >
      <Link to={`/product?id=${product._id}`}>
        {filteredImages.map((image, imgIndex) => (
          <img
            key={imgIndex}
            className={imgIndex === 0 ? "default-img" : "hover-img"}
            src={image.filePath}
            alt={`Image-${product._id}-${imgIndex}`}
          />
        ))}
      </Link>
      <span className="red">{product.discount}</span>
    </div>
  );
};

export default ProductImageGallery;
