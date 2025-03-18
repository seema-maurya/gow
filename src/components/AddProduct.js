// AddProduct.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../css/ProductImage.css";
import { FaTimes, FaHome, FaEdit, FaTrash } from "react-icons/fa";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const AddProduct = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [clothingCompanyOptions, setClothingCompanyOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [skuCode, setSkuCode] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productIdToUpdate, setProductIdToUpdate] = useState(null);
  const [defaultDisabled, setDefaultDisabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [colorOptions] = useState(["Red", "Blue", "Green", "Black", "White"]);
  const [availableSizes, setAvailableSizes] = useState([
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XS",
    "2XL",
    "3XL",
    "4XL",
  ]);
  const [customSize, setCustomSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    color: "",
    subvariant: [],
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState(null); // To track which variant is being edited
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  // Extracting product ID from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setProductIdToUpdate(id);
    console.log("ID FROM URL : ", id);
    if (id) {
      fetchProductByProductId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdToUpdate]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    setIsAdmin(isAdmin);
    if (isAdmin) {
      fetchCategoryOptions();
    }
  }, []);

  const handleVariantChange = (index, field, value) => {
    setNewVariant((prevState) => {
      const updatedSubvariant = [...prevState.subvariant];
      updatedSubvariant[index] = {
        ...updatedSubvariant[index],
        [field]: value,
      };

      return {
        ...prevState,
        subvariant: updatedSubvariant,
      };
    });
  };

  const handleSizeCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setNewVariant((prevState) => {
      const { subvariant } = prevState;

      if (checked) {
        const newSubvariant = [
          ...subvariant,
          { size: value, price: 0, mrpPrice: 0, quantity: 0 },
        ];

        return {
          ...prevState,
          subvariant: newSubvariant,
        };
      } else {
        // Remove the size from the subvariant list if unchecked
        const filteredSubvariant = subvariant.filter(
          (item) => item.size !== value
        );
        return {
          ...prevState,
          subvariant: filteredSubvariant,
        };
      }
    });
  };

  const handleCustomSizeChange = (e) => {
    setCustomSize(e.target.value);
  };

  const handleAddCustomSize = () => {
    if (!customSize?.trim()) {
      toast.info("Enter custom size if you want");
      return;
    }

    const sizeExists = availableSizes.some(
      (size) => size.toLowerCase() === customSize.toLowerCase()
    );

    if (!sizeExists) {
      setAvailableSizes((prevSizes) => [...prevSizes, customSize]);
      setNewVariant((prevState) => ({
        ...prevState,
        subvariant: [
          ...prevState.subvariant,
          { size: customSize, price: 0, mrpPrice: 0, quantity: 0 },
        ],
      }));
      setCustomSize("");
      setMessage("");
    } else {
      toast.info("Already exist");
      setCustomSize("");
      setMessage(`This size "${customSize}" already exists!`);
    }
  };

  const removeSize = (size) => {
    setNewVariant((prevState) => ({
      ...prevState,
      subvariant: prevState.subvariant.filter(
        (variant) => variant.size !== size
      ),
    }));
    toast.info(`Size "${size}" has been removed.`);
  };

  const addVariant = () => {
    const { color, subvariant } = newVariant;

    // Ensure all necessary fields are filled out
    if (!color || subvariant?.length === 0) {
      toast.info(
        "Please fill all the variant fields including size, price, MRP, and quantity."
      );
      return;
    }

    // Check if each subvariant (size) has all the fields filled
    const allFieldsFilled = subvariant.every(
      (item) => item.size && item.price && item.mrpPrice && item.quantity
    );

    if (!allFieldsFilled) {
      toast.info(
        "Please make sure every size has price, MRP, and quantity filled."
      );
      return;
    }

    // Check if the color already exists in the variants
    const colorExists = variants.some(
      (variant, index) =>
        variant.color.toLowerCase() === color.toLowerCase() &&
        index !== editingVariantIndex // Skip the check if editing the same variant
    );

    if (colorExists) {
      toast.error(
        "This color has already been added. Please choose a different color."
      );
      return;
    }

    if (editingVariantIndex !== null) {
      // If we're editing an existing variant
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = { color, subvariant };

      setVariants(updatedVariants);
      setNewVariant({ color: "", subvariant: [] });
      setEditingVariantIndex(null); // Reset editing index after update

      toast.success("Variant updated successfully!");
    } else {
      // Add a new variant if we're not editing
      setVariants((prevVariants) => [...prevVariants, newVariant]);
      setNewVariant({
        color: "",
        subvariant: [],
      });

      toast.success("Variant added successfully!");
    }
  };

  const removeVariant = (index) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.filter((_, i) => i !== index);
      toast.success("Variant removed successfully!"); // Optional: Notify user of removal
      return updatedVariants;
    });
  };

  const fetchProductByProductId = async (productIdToUpdate) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}product/getProductById/${productIdToUpdate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        console.error("Product not found");
        toast.error("Product not found");
        // Navigate("/");
        window.location = "/";
        window.location = process.env.REACT_APP_API_URL_FOR_GUI;
        return;
      }

      const productData = await response.json();
      console.log("FetchProductById: ", productData);
      setTimeout(() => {
        setDefaultDisabled(true);
        setSelectedCategory(productData.categoryName);
        setSelectedSubCategory(productData.subCategoryName);
        setSelectedBrand(productData.brandName);
        setProductName(productData.productName);
        setSkuCode(productData.skuCode);
        setManufacturer(productData.manufacturer);
        setProductDescription(productData.productDescription);
        setProductImages(productData.productImages);
        setVariants(productData.variants);

        if (productData.categoryName) {
          fetchSubCategoryOptions(productData.categoryName);
        }
        if (productData.subCategoryName) {
          fetchClothingCompanyBrandOptions(
            productData.subCategoryName,
            productData.categoryName
          );
        }
      }, 100);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}category/allCategory`
      );
      console.log("Category Response:", response);
      const categoryOptions = response.data?.map(
        (category) => category.categoryName
      );

      console.log("Category Options:", categoryOptions);
      setCategoryOptions(categoryOptions);
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  const fetchSubCategoryOptions = async (selectedCategory) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}subcategory/getSubcategoriesByCategoryName/${selectedCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const subcategoryData = await response.json();
      console.log("SubCategory Response:", subcategoryData);

      const subCategoryOptions = subcategoryData?.map(
        (subcategory) => subcategory.subCategoryName
      );
      console.log("SubCategory Options:", subCategoryOptions);

      setSubCategoryOptions(subCategoryOptions);
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
    }
  };

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;

    setSelectedCategory(selectedCategory);
    fetchSubCategoryOptions(selectedCategory);
  };

  const fetchClothingCompanyBrandOptions = async (
    selectedSubCategory,
    selectedCategory
  ) => {
    try {
      if (!selectedCategory || !selectedSubCategory) {
        throw new Error("Both category and subcategory must be provided.");
      }

      const response = await fetch(
        process.env.REACT_APP_API_URL +
          `brand/getClothingCompanyBySubcategoryName/${selectedCategory}/${selectedSubCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `API request failed with status: ${response.status} - ${response.statusText}`
        );
      }

      const clothingCompanyData = await response.json();
      console.log("clothingCom Response:", clothingCompanyData);

      if (!Array.isArray(clothingCompanyData)) {
        throw new Error("Invalid API response format: Expected an array.");
      }

      const clothingCompanyOptions = clothingCompanyData?.map(
        (clothingCompanydata) => clothingCompanydata.clothingCompanyName
      );
      console.log("clothingCompanyName Options:", clothingCompanyOptions);

      setClothingCompanyOptions(clothingCompanyOptions);
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
      setClothingCompanyOptions([]);
    }
  };

  const handleSubCategoryChange = async (e) => {
    const newSelectedSubCategory = e.target.value;
    setSelectedSubCategory(newSelectedSubCategory);

    if (selectedCategory) {
      await fetchClothingCompanyBrandOptions(
        newSelectedSubCategory,
        selectedCategory
      );
    } else {
      console.error("Selected category is not set yet!");
    }
  };

  // ********************************************************************************************

  const handleAddProduct = async () => {
    const userEmail = localStorage.getItem("userEmail");
    setIsLoading(true);
    try {
      if (!selectedCategory || selectedCategory?.length === 0) {
        toast.warning("Please select Category !");
        return;
      }
      if (!selectedSubCategory || selectedSubCategory?.length === 0) {
        toast.warning("Please select SubCategory !");
        return;
      }
      if (!selectedBrand || selectedBrand?.length === 0) {
        toast.warning("Please select Brand !");
        return;
      }
      if (!variants || variants?.length === 0) {
        toast.info("Please Add Variants");
        return;
      }
      if (!productImages || productImages?.length === 0) {
        toast.warning("Please upload product images");
        return;
      }

      const productData = {
        userEmail,
        categoryName: selectedCategory,
        subCategoryName: selectedSubCategory,
        brandName: selectedBrand,
        productName,
        skuCode,
        manufacturer,
        productDescription,
        productImages,
        variants,
      };

      let response;

      // Check if productIdToUpdate is present, if yes, update the product, else, add a new product
      if (productIdToUpdate) {
        console.log("productData : ", productData);
        response = await axios.put(
          process.env.REACT_APP_API_URL + `product/update/${productIdToUpdate}`,
          productData
        );
      } else {
        response = await axios.post(
          process.env.REACT_APP_API_URL + "product/add",
          productData
        );
      }

      if (response.status === 201) {
        resetForm();
        toast.success("Product added successfully", { autoClose: 2000 });
        console.log(response.status);
      } else if (response.status === 200) {
        toast.success("Product updated successfully", { autoClose: 2000 });
        console.log(response.status);
      } else {
        toast.error("Failed to add product");
        console.log(response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data.message;
        toast.error(errorData);
      } else {
        toast.error("Failed to add product. Please try again.");
      }
    } finally {
      setIsLoading(false);  
    }
    // window.location.reload();
  };
  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedBrand("");
    setProductName("");
    setSkuCode("");
    setManufacturer("");
    setProductDescription("");
    setProductImages([]);
    setVariants([]);
    setSelectedColor("");
    setProductImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This will reset the file input field
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;

    // Check if a color is selected
    if (!selectedColor) {
      toast.info("Please select a color before uploading files.");
      return;
    }

    // Check if the total number of files exceeds 15
    if (files?.length + productImages?.length > 15) {
      alert("You can only upload a maximum of 15 files (images or videos).");
      return;
    }

    try {
      const updatedFiles = [...productImages];
      const filePromises = Array.from(files)?.map(async (file, index) => {
        const fileType = file.type.split("/")[0]; // Detect 'image' or 'video'
        const allowedImageFormats = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const allowedVideoFormats = ["video/mp4", "video/webm", "video/ogg"];

        const resizeImage = async (file) => {
          const img = new Image();
          const fileReader = new FileReader();

          return new Promise((resolve, reject) => {
            fileReader.onload = (event) => {
              img.src = event.target.result;
            };
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const maxFileSize = 4 * 1024 * 1024; // Target ~4MB
              let quality = 0.8; // Initial quality

              // Set canvas dimensions
              canvas.width = img.width;
              canvas.height = img.height;

              // Draw the image to the canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              // Compress the image
              let compressedDataURL;
              do {
                compressedDataURL = canvas.toDataURL(file.type, quality);
                quality -= 0.05; // Reduce quality incrementally
              } while (
                compressedDataURL.length > maxFileSize &&
                quality > 0.1 // Ensure not to go below a reasonable quality threshold
              );

              // Convert the data URL back to a Blob
              const compressedBlob = dataURLtoBlob(compressedDataURL);
              resolve(compressedBlob);
            };

            img.onerror = (error) => reject(error);
            fileReader.readAsDataURL(file);
          });
        };

        // Convert DataURL to Blob
        const dataURLtoBlob = (dataURL) => {
          const [header, base64] = dataURL.split(",");
          const mime = header.match(/:(.*?);/)[1];
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          return new Blob([array], { type: mime });
        };

        // Handle Image Upload
        if (fileType === "image" && allowedImageFormats.includes(file.type)) {
          let finalFile = file;
          if (file.size > 5 * 1024 * 1024) {
            finalFile = await resizeImage(file);
            //Make here code for if greater than size of that image so make some do that 4mb make that size
          }
          if (finalFile.size <= 5 * 1024 * 1024) {
            // Check file size (5MB limit)
            const base64String = await fileToBase64(finalFile);
            return {
              dataURL: base64String, // Ensure this is a valid base64 string
              fileName: file.name,
              type: file.type, // Exact MIME type like image/jpeg
              size: Math.round(finalFile.size / 1024), // Size in KB
              description: `${
                fileType.charAt(0).toUpperCase() + fileType.slice(1)
              } for ${selectedColor}`,
              color: selectedColor,
              filePath: `/home/ClothingImages/${file.name.split(".")[0]}.${
                file.type.split("/")[1]
              }.webp`, // Correctly formatted file path
              status: 1, // Active status
            };
          } else {
            throw new Error(
              `Image ${file.name} is too large. Maximum size is 5MB.`
            );
          }

          // Handle Video Upload
        } else if (
          fileType === "video" &&
          allowedVideoFormats.includes(file.type)
        ) {
          if (file.size <= 50 * 1024 * 1024) {
            // Set a file size limit for videos (50MB)
            const base64String = await fileToBase64(file);
            return {
              dataURL: base64String, // Ensure this is a valid base64 string
              fileName: file.name,
              type: file.type, // Exact MIME type like video/mp4
              size: Math.round(file.size / 1024), // Size in KB
              description: `video ${
                fileType.charAt(0).toUpperCase() + fileType.slice(1)
              } for ${selectedColor}`,
              color: selectedColor,
              filePath: `/home/ClothingImages/${file.name.split(".")[0]}.${
                file.type.split("/")[1]
              }`, // Correctly formatted file path
              status: 1, // Active status
            };
          } else {
            throw new Error(
              `Video ${file.name} is too large. Maximum size is 50MB.`
            );
          }
        } else {
          throw new Error(
            `Unsupported file type or file too large. File: ${file.name}`
          );
        }
      });

      // Process all file promises
      const newFiles = await Promise.all(filePromises);
      setProductImages([...updatedFiles, ...newFiles]);
    } catch (error) {
      console.error("Error uploading files:", error.message);
      alert(error.message);
    }
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleEditVariant = (index) => {
    const variantToEdit = variants[index];
    setNewVariant(variantToEdit);
    setEditingVariantIndex(index);
  };

  const isProductNameEmpty = productName?.trim() === "";
  const isCategoryEmpty = selectedCategory === "";
  const isSubCategoryEmpty = selectedSubCategory === "";
  const isBrandEmpty = selectedBrand === "";
  const isSkuCodeEmpty = skuCode?.trim() === "";
  const isManufacturerEmpty = manufacturer?.trim() === "";
  const isDescriptionEmpty = productDescription?.trim() === "";
  const areVariantsEmpty = variants?.length === 0;

  const isFormInvalid =
    isProductNameEmpty ||
    isCategoryEmpty ||
    isSubCategoryEmpty ||
    isBrandEmpty ||
    isSkuCodeEmpty ||
    isManufacturerEmpty ||
    isDescriptionEmpty ||
    areVariantsEmpty;

  return (
    <>
      {/* <div className="add-product-container"> */}
      {isLoading && (
        <div className="overlay">
          <div className="processing-modal">
            <div className="spinner"></div>
            <p>
              <span className="processing">Loading</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </p>
          </div>
        </div>
      )}
      {isAdmin ? (
        <div className="tab-buttons">
          <div className={productIdToUpdate ? "add-product-container" : ""}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                // alignItems: "center",
                padding: "0px 0",
              }}
            >
              <h1 className="h1">Add Product</h1>
              {!productIdToUpdate && (
                <h1 className="h1">
                  <button
                    onClick={() => (window.location.href = "/product-list")}
                    className="add-category-button"
                  >
                    Product List
                  </button>
                </h1>
              )}
            </div>
            <div className="form-group">
              <label>
                Category
                :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  id="categorySelectId"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={defaultDisabled ? true : null}
                  required
                >
                  <option value="">Select a category</option>
                  {categoryOptions?.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                SubCategory:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  id="subCategorySelectId"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={defaultDisabled ? true : null}
                  required
                >
                  <option value="">Select a subcategory</option>
                  {subCategoryOptions?.map((subcategoryName) => (
                    <option key={subcategoryName} value={subcategoryName}>
                      {subcategoryName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Clothing Company :&nbsp;
                <select
                  id="brandSelectId"
                  value={selectedBrand}
                  disabled={defaultDisabled ? true : null}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  required
                >
                  <option value="">Select a Brand</option>
                  {clothingCompanyOptions?.map((clothingCompanyName) => (
                    <option
                      key={clothingCompanyName}
                      value={clothingCompanyName}
                    >
                      {clothingCompanyName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Product Name<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter Product Name"
                  required
                />
              </label>
              <label>
                SKU Code<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  placeholder="Enter product quantity"
                  required
                />
              </label>
              <label>
                Manufacturer<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Enter product quantity"
                  required
                />
              </label>

              <label>
                Product Description:
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Enter product description"
                  required
                />
              </label>
              <label>
                <div>
                  <div
                    className="variant-section"
                    style={{ height: "500px", overflowY: "scroll" }}
                  >
                    <h2>Product Variants</h2>
                    <input
                      type="text"
                      name="color"
                      value={newVariant.color || ""}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, color: e.target.value })
                      }
                      placeholder="Color"
                      required
                    />
                    <div className="variant-selectsize-section">
                      <h4>
                        Select Sizes<span style={{ color: "red" }}>*</span>:{" "}
                      </h4>
                      <div className="size-checkbox-container">
                        {availableSizes?.map((size, index) => (
                          <label key={index}>
                            <input
                              type="checkbox"
                              value={size}
                              checked={
                                Array.isArray(newVariant.subvariant) &&
                                newVariant.subvariant.some(
                                  (s) => s.size === size
                                )
                              }
                              onChange={handleSizeCheckboxChange}
                              required
                            />

                            <label htmlFor={`size-${size}`}>{size}</label>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div
                      className="custom-size-input"
                      style={{
                        width: "auto",
                        display: "inline-flex",
                        flexDirection: "row",
                      }}
                    >
                      <label>
                        Or Add Custom Size:
                        <input
                          style={{ width: "auto", display: "" }}
                          type="text"
                          value={customSize}
                          onChange={handleCustomSizeChange}
                          placeholder="Enter custom size"
                        />
                      </label>
                      <button
                        style={{ width: "auto", marginTop: "2px" }}
                        onClick={handleAddCustomSize}
                      >
                        Add Size
                      </button>
                    </div>
                    {message && (
                      <div style={{ color: "red", marginTop: "4px" }}>
                        {message}
                      </div>
                    )}

                    <div className="variant-input-section">
                      {Array.isArray(newVariant.subvariant) &&
                        newVariant.subvariant?.map((sub, index) => (
                          <div key={index} className="size-inputs">
                            <h4>Size: {sub.size}</h4>
                            Price :
                            <input
                              type="number"
                              name={`price-${sub.size}`}
                              value={sub.price || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              min="0"
                              placeholder="Price"
                              required
                            />
                            MRP:
                            <input
                              type="number"
                              name={`mrpPrice-${sub.size}`}
                              value={sub.mrpPrice || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "mrpPrice",
                                  e.target.value
                                )
                              }
                              min={0}
                              placeholder="MRP Price"
                              required
                            />
                            {/* Quantity Input */}
                            Quantity:
                            <input
                              type="number"
                              name={`quantity-${sub.size}`}
                              value={sub.quantity || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              min={0}
                              placeholder="Quantity"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeSize(sub.size)}
                              style={{
                                marginTop: "5px",
                                width: "auto",
                                fontSize: "12px",
                              }}
                            >
                              <FaTrash /> Remove Size {sub.size}
                            </button>
                          </div>
                        ))}
                    </div>
                    <button
                      type="button"
                      onClick={addVariant}
                      style={{
                        marginTop: "20px",
                        width: "250px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                      disabled={
                        !newVariant.color || newVariant.subvariant?.length === 0
                      }
                      title={
                        !newVariant.color || newVariant.subvariant?.length === 0
                          ? "Please fill the product variants details"
                          : "Add Variants"
                      }
                    >
                      {editingVariantIndex !== null
                        ? "Save Changes"
                        : "Add Variant"}
                    </button>

                    {/* Display existing variants */}
                    <div className="variant-list">
                      {variants && variants?.length > 0 ? (
                        variants?.map((variant, index) => (
                          <div className="variant-size-section" key={index}>
                            <h2>Existing Variants</h2>
                            <button
                              style={{
                                marginTop: "5px",
                                width: "100px",
                                borderRadius: "20px",
                                fontSize: "12px",
                              }}
                              onClick={() => handleEditVariant(index)}
                            >
                              <FaEdit />
                              Edit
                            </button>
                            <h3>Color: {variant.color}</h3>
                            {variant.subvariant &&
                            variant.subvariant?.length > 0 ? (
                              variant.subvariant?.map((sub, i) => (
                                <div className="variant-section" key={i}>
                                  <p>Size: {sub.size}</p>
                                  <p>Price: {sub.price}</p>
                                  <p>MRP Price: {sub.mrpPrice}</p>
                                  <p>Quantity: {sub.quantity}</p>
                                </div>
                              ))
                            ) : (
                              <p>No sizes available for this variant.</p>
                            )}
                            <button
                              className="remove-variant-button"
                              type="button"
                              style={{
                                marginTop: "10px",
                                width: "200px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                backgroundColor: "#ff4d4f",
                              }}
                              onClick={() => removeVariant(index)}
                            >
                              <FaTrash />
                              Remove {variant.color} Variant
                            </button>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "red" }}>
                          No variants available Please add the variants.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="product-images-selection">
                    <div>
                      <label>Select Images Color:</label>
                      <div
                        style={{
                          position: "relative",
                          display: " ",
                        }}
                      >
                        <input
                          type="text"
                          value={selectedColor}
                          onChange={handleColorChange}
                          placeholder="Type or select a color"
                          style={{
                            width: "100%",
                            padding: "10px",
                            paddingRight: "30px", // Extra space for the select dropdown
                          }}
                          required
                        />
                        <select
                          value={selectedColor}
                          onChange={handleColorChange}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "0",
                            bottom: "0",
                            width: "150px",
                            border: "none",
                            background: "transparent",
                            appearance: "", // Remove default arrow
                            cursor: "pointer",
                            fontWeight: "bold", // Make the text inside the select bold
                          }}
                        >
                          <option value="" disabled>
                            Select Colour
                          </option>
                          {colorOptions
                            .filter((color) =>
                              color
                                .toLowerCase()
                                .includes(selectedColor.toLowerCase())
                            )
                            ?.map((color, index) => (
                              <option key={index} value={color}>
                                {color}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="upload-images">
                      Upload Images:
                      <input
                        type="file"
                        multiple
                        onChangeCapture={handleImageUpload}
                        disabled={productImages?.length >= 15}
                        ref={fileInputRef}
                      />
                    </div>

                    <div
                      className="image-preview"
                      style={{ maxHeight: "300px", overflowY: "scroll" }}
                    >
                      {productImages &&
                        productImages?.map((media, index) => (
                          <div className="image-preview-item" key={index}>
                            {/* Conditional rendering for image or video */}
                            {media.type?.startsWith("image") ? (
                              <img
                                src={media.dataURL}
                                alt={`Product Imagee ${index + 1}`}
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                }} // Added styles for better fit
                              />
                            ) : media?.type?.startsWith("video") ? (
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                }} // Added styles for better fit
                              >
                                <source src={media.dataURL} type={media.type} />
                                Your browser does not support the video tag.
                              </video>
                            ) : null}

                            {/* Display metadata */}
                            <p>Color: {media.color}</p>
                            <p>Names: {media.fileName}</p>
                            <p>Description: {media.description}</p>
                            <p>Size: {media.size} KB</p>

                            <FaTimes
                              className="delete-icon"
                              onClick={() => handleDeleteImage(index)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </label>

              <button
                style={{ fontSize: "16px", width: "90%" }}
                onClick={handleAddProduct}
                disabled={isFormInvalid}
                className="ADD_Product"
              >
                {productIdToUpdate ? "Update" : "Add Product"}
              </button>

              <p
                className="next-subcategory"
                style={{ marginLeft: "100 px", padding: "50px" }}
              >
                <Link to="/home">
                  <FaHome />
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddProduct;
