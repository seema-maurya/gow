import { createContext, useContext, useState, useEffect } from "react";
import { fetchAllCart } from "./cartFunctions"; // Import your fetch function

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedSizeVariants, setSelectedSizeVariants] = useState("");
  const selectedSizes = selectedSizeVariants;
  const setSelectedSizes = setSelectedSizeVariants;

  useEffect(() => {
    const initialize = async () => {
      await fetchAllCart(setCart, setSelectedSizeVariants);
    };
    initialize();
  }, [setCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        selectedSizeVariants,
        setSelectedSizeVariants,
        selectedSizes,
        setSelectedSizes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
