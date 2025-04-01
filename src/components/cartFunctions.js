import { toast } from "react-toastify";
import axios from "axios";

// This function gets the default size, which is the first size if only one size is available
export const renderShareOptions = (
  index,
  prod,
  showShareOptions,
  handleShareButtonClick
) => {
  return showShareOptions === index ? (
    <div
      className="share-options"
      style={{
        position: "",
        top: "100%",
        left: "10%",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: -2,
        lineHeight: "0px",
        height: "400px",
      }}
    >
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(prod.productName)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#3b5998",
        }}
      >
        <i className="fa fa-facebook"></i>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#1da1f2",
        }}
      >
        <i className="fa fa-twitter"></i>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#0077b5",
        }}
      >
        <i className="fa fa-linkedin"></i>
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(
          prod.productName
        )}&body=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#dd4b39",
        }}
      >
        <i className="fa fa-envelope"></i>
      </a>
    </div>
  ) : (
    <button
      className="share-button"
      style={{
        backgroundColor: "red",
        border: "none",
        color: "white",
        cursor: "pointer",
        padding: "0px",
        borderRadius: "2px",
        position: "inherit",
      }}
      onClick={(e) => handleShareButtonClick(index, e)}
    >
      <i className="pe-7s-share"></i>
    </button>
  );
};

export const renderColorOptions = (
  prod,
  selectedImageIndex,
  handleColorSelect,
  handleImageSelect
) => {
  const uniqueColors = new Set(); // To track unique colors
  const isValidColor = (color) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== ""; // Returns true if the color is valid
  };
  const hashColor = (colorName) => {
    let hash = 0;
    for (let i = 0; i < colorName.length; i++) {
      hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hexColor = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - hexColor.length) + hexColor;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        marginTop: "10px",
      }}
    >
      {prod.productImages && prod.productImages.length > 0 ? (
        prod.productImages
          .filter((colour) => {
            // Check if the lowercase color has already been added to the Set
            const colorLowerCase = (colour.color || "").toLowerCase().trim();
            if (!uniqueColors.has(colorLowerCase)) {
              uniqueColors.add(colorLowerCase); // Add to Set if not present
              return true; // Keep this color
            }
            return false; // Skip if color is already present
          })
          .map((colour, index) => {
            // Validate color or fallback to default
            const backgroundColor = isValidColor(colour.color)
              ? colour.color
              : hashColor(colour.color.trim() || "Unknown");
            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleColorSelect(prod._id, colour.color)}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: backgroundColor || "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                  title={`${colour.color || "Unknown"}${
                    colour.accents && colour.accents.length > 0
                      ? ` with ${colour.accents.join(", ")}`
                      : ""
                  }`}
                />
                <div
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor:
                      index === selectedImageIndex
                        ? "rgba(0,0,0,0.3)"
                        : "transparent",
                    margin: "0 5px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={colour.filePath}
                    alt={`Thumbnail ${index}`}
                    title={`${colour.color} ${prod.brandName}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p>
                  {colour.color || "Unknown"}
                  {colour.accents && colour.accents.length > 0
                    ? ` + ${colour.accents.join(", ")}`
                    : ""}
                </p>{" "}
              </div>
            );
          })
      ) : (
        <p>No colors available</p>
      )}
    </div>
  );
};

export const getProductDefaultSize = (productId, product) => {
  const products = product._id === productId;
  return products ? product.defaultSize : "";
};

export const filterLatestProducts = (products) => {
  const currentDate = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

  return products.filter((prod) => {
    const prodDate = parseDateString(prod.created_at);
    if (!prodDate) return false; // Skip if date parsing fails

    // Check if the product date is within the last 2 months
    return prodDate <= twoMonthsAgo && prodDate <= currentDate;
  });
};

export const parseDateString = (dateString) => {
  try {
    // Parse date string using a more robust approach
    const parsedDate = new Date(dateString);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid Date");
    }
    return parsedDate;
  } catch (error) {
    console.error("Error parsing date string:", dateString, error);
    return null;
  }
};

export const handleSizeChange = (_id, e, setSelectedSizes) => {
  const { value } = e.target;
  setSelectedSizes((prevSelectedSizes) => {
    const updatedSizes = {
      ...prevSelectedSizes,
      [_id]: value,
    };
    localStorage.setItem("selectedSizes", JSON.stringify(updatedSizes));
    return updatedSizes;
  });
};

export const handleRefreshPage = () => {
  window.location.reload();
};

export const handleVariantAddToCart = async (
  product,
  cart,
  setCart,
  selectedSizeVariants,
  setSelectedSizes,
  selectedColor, // Add color as a parameter
  availableQuantity,
  variantPrice,
  variantMrpPrice
) => {
  const userId = localStorage.getItem("userId");
  const requestedQuantity = 1; // You can update this logic for custom quantities

  // Ensure selected size and color are available
  if (!selectedSizeVariants || !selectedColor) {
    alert("Please select a valid size and color");
    return;
  }

  // Validate if requested quantity is available
  if (requestedQuantity > availableQuantity) {
    alert(`Only ${availableQuantity} items available for this variant.`);
    return;
  }

  if (userId) {
    // User is logged in, add product to backend cart
    const data = await addProductVariantToCartBackend(
      product._id,
      requestedQuantity,
      userId,
      selectedSizeVariants, // Include selected size in backend request
      selectedColor,
      variantPrice,
      variantMrpPrice
    );

    if (data) {
      console.log("Product added to cart successfully:", data);
      await fetchAllCart(setCart, setSelectedSizes); // Optionally update frontend cart state here
    }
  } else {
    // User is not logged in, add product to local cart
    if (selectedSizeVariants[product._id]) {
      const updatedCart = addToVariantCartss(
        product,
        cart,
        setCart,
        requestedQuantity,
        selectedColor, // Add selected color to cart item
        selectedSizeVariants // Add selected size to cart item
      );
      if (updatedCart) {
        saveCartToLocalStorage(updatedCart);
      }
    } else {
      alert("PLease Login!!!");
      window.location = "/login";
    }
  }
};

export const addToVariantCartss = (
  product,
  cart,
  setCart,
  quantity,
  selectedColor, // Add selected color
  selectedSize // Add selected size
) => {
  // Find if the item with the same product ID, size, and color exists in the cart
  const index = cart.findIndex(
    (item) =>
      item._id === product._id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );

  const availableQuantity = product.productQuantity;
  const existingCartItem = cart.find(
    (item) =>
      item._id === product._id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );

  const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

  // Validate if adding the requested quantity exceeds available stock
  if (currentQuantity + quantity > availableQuantity) {
    alert("Cannot add more items than available in stock.");
    return null;
  }

  if (index !== -1) {
    // If the variant (size & color) already exists, update its quantity and amount
    const updatedCart = [...cart];
    updatedCart[index].quantity += quantity;
    updatedCart[index].amount =
      updatedCart[index].quantity * updatedCart[index].productPrice;
    setCart(updatedCart);
    return updatedCart;
  } else {
    // If the variant doesn't exist, create a new entry in the cart
    const newProduct = {
      ...product,
      quantity: quantity,
      amount: quantity * product.productPrice,
      selectedColor: selectedColor, // Store selected color
      selectedSize: selectedSize, // Store selected size
    };
    const updatedCart = [...cart, newProduct];
    setCart(updatedCart);
    return updatedCart;
  }
};

export const handleRemoveFromCartVariant = async (
  index,
  cart,
  setCart,
  productId
) => {
  const updatedCart = [...cart];
  const userId = localStorage.getItem("userId");

  if (userId) {
    // User is logged in, so call the backend to remove the item from the cart
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}cart/deleteCart`,
        {
          data: { _id: productId, userId }, // Send productId and userId in the request body
        }
      );

      if (response.status === 200) {
        // Successfully removed from backend, now update the frontend
        updatedCart.splice(index, 1);
        setCart(updatedCart);
      } else {
        console.error(
          "Failed to remove product from cart:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  } else {
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  }
};

export const addProductVariantToCartBackend = async (
  productId,
  quantity,
  userId,
  selectedSizes,
  selectedColor,
  variantPrice,
  variantMrpPrice
) => {
  if (selectedSizes && selectedColor) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "cart/variantAddcart",
        {
          _id: productId,
          quantity: quantity,
          userId: userId,
          selectedSizes: selectedSizes, // Include selected size
          selectedColor: selectedColor,
          variantPrice,
          variantMrpPrice,
        }
      );

      if (response.status === 201) {
        return response.data;
      } else if (
        response.status === 200 &&
        response.data.maxQuantity !== undefined
      ) {
        toast.info("Limit Exceed: " + response.data.message);
        return null;
      } else {
        console.error("Failed to add product to cart:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return null;
    }
  } else {
    alert("Please select both a size and color.");
  }
};

export const handleRemoveFromCart2Variant = async (
  productToRemove,
  cart,
  setCart,
  selectedSizeVariants,
  setSelectedSizes,
  selectedColor,
  setIsProcessing
) => {
  const selectedSizess =
    selectedSizeVariants[productToRemove._id] ||
    getProductDefaultSize(productToRemove._id, productToRemove);

  const updatedCart = [...cart];
  const index = updatedCart.findIndex(
    (item) =>
      item._id === productToRemove._id &&
      item.selectedSizes === selectedSizess &&
      item.selectedColor === selectedColor // Ensure the correct variant (size & color) is targeted
  );

  const userId = localStorage.getItem("userId");
  const requestedQuantity = -1; // Or whatever logic you have for quantity reduction

  if (userId) {
    // User is logged in, update the backend cart
    setIsProcessing(true);

    const data = await addProductVariantToCartBackend(
      productToRemove._id,
      requestedQuantity,
      userId,
      selectedSizeVariants, // Include selected size in backend request
      selectedColor
    );

    if (data) {
      console.log("Product removed from cart successfully:", data);
      await fetchAllCart(setCart, setSelectedSizes); // Update the frontend cart state
    }
    setIsProcessing(false);
  } else {
    // User is not logged in, update the local cart
    if (index !== -1) {
      if (updatedCart[index].quantity > 1) {
        // Decrease the quantity if more than one
        updatedCart[index].quantity -= 1;
        updatedCart[index].amount -= updatedCart[index].productPrice; // Adjust the total price
      } else {
        // Remove the item if quantity becomes zero
        updatedCart.splice(index, 1);
      }

      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart); // Save the updated cart to local storage
    }
  }
};

export const fetchAllCart = async (setCart, setSelectedSizes) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}cart/getIdCart`,
        {
          params: { userId },
        }
      );
      if (
        response.data &&
        response.data.responseCart &&
        Array.isArray(response.data.responseCart.items)
      ) {
        console.log("fetchAllCartResponse", response.data.responseCart.items);
        const cartData = response.data.responseCart.items;
        const selectedSizes = {};
        cartData.forEach((item) => {
          selectedSizes[item._id] = item.selectedSizes;
        });
        setSelectedSizes(selectedSizes);
        await setCart(response.data.responseCart.items);
      } else if (
        (response.status === 404 &&
          response.data.message === "Cart is empty") ||
        response.status === 204
      ) {
        // console.log("cart is empty", response);
        setCart([]);
        setSelectedSizes({});
      } else {
        console.error("Unexpected response structure:", response);
        setCart([]);
        setSelectedSizes({});
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  } else {
    console.info({ error: "User not logged in" });
  }
};
///IMPORTANT
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const handleClearCart = async (
  setCart,
  confirm = false,
  setSelectedSizes
) => {
  const confirmed =
    confirm || window.confirm("Are you sure you want to clear the cart?");
  if (confirmed) {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // User is logged in, so call the backend to clear the cart
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}cart/cart/clear`,
          {
            data: { userId }, // Send userId in the request body
          }
        );

        if (response.status === 200) {
          // Successfully cleared from backend, now update the frontend
          localStorage.removeItem("cart");
          console.log("Cart cleared successfully.");

          setCart([]);
        } else {
          console.error("Failed to clear the cart:", response.statusText);
        }
      } catch (error) {
        console.error("Error clearing the cart:", error);
      }
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  } else {
    console.log("Clear cart action cancelled.");
    toast("cancelled");
  }
};

export const calculateTotal = (cart) => {
  let total = 0;
  if (cart) {
    cart.forEach((item) => {
      const price = parseFloat(item.variantPrice);
      const quantity = parseInt(item.variantQuantity);
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity;
      }
    });
  }
  const shippingCost = 0;
  total += shippingCost;
  return total;
};
