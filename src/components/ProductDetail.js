import React, { useState, useEffect } from "react";
import ProductDetailID from "./ProductDetailID.js";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // New state to hold the selected color
  const [sizeChoose, setSizeChoose] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const color = urlParams.get("color"); // Fetch the color from query parameters
    const size = urlParams.get("size");
    setSelectedColor(color); // Set the selected color in the state
    setSizeChoose(size);
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}product/getAllProducts?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Product detaild by Id", data);
        if (
          data &&
          (Array.isArray(data) ? data.length === 0 : !data.productName)
        ) {
          // navigate("/");
          window.location = "/";
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // navigate("/");
        window.location = "/";
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  if (!product) {
    return <div>Loading...</div>; // Handle loading state
  }

  // return <ProductDetailID product={product} />;
  return (
    <ProductDetailID
      product={product}
      selectedColorChoose={selectedColor}
      sizeChoose={sizeChoose}
    />
  );
};

export default ProductDetail;
