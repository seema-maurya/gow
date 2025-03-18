import React from "react";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import ProductActions from "./ProductActions";

export const renderProductList = (categoryName, products, findCartItem) => {
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
                <ProductImageGallery
                  product={prod}
                  selectedColor={this.state.selectedColors[prod._id]}
                  handleProductClick={() => this.handleProductClick(prod)}
                />
                <ProductActions
                  product={prod}
                  renderShareOptions={this.renderShareOptions}
                  renderCartButton={this.renderCartButton}
                  isCartQuantityMaxed={isCartQuantityMaxed}
                />
                <ProductDetails
                  product={prod}
                  selectedSizes={this.state.selectedSizes}
                  getDefaultSize={this.getDefaultSize}
                  handleSizeChange={this.handleSizeChange}
                  handleProductClick={() => this.handleProductClick(prod)}
                  renderAverageStarRating={this.renderAverageStarRating}
                  productRatings={this.state.productRatings}
                  renderColorOptions={this.renderColorOptions}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
