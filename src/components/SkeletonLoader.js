import React from "react";
import PropTypes from "prop-types";

// SkeletonLoader Component that reflects the HTML structure
const SkeletonLoader = ({ children, isLoading }) => {
  return (
    <div className={isLoading ? "skeleton-loading" : ""}>
      {React.Children.map(children, (child) => {
        if (typeof child === "string" || child === null) {
          return child; // No need to apply skeleton class to plain text
        }
        return React.cloneElement(child, {
          className:
            (child.props.className || "") + (isLoading ? " skeleton" : ""),
        });
      })}
    </div>
  );
};
// PropTypes to ensure the correct data is passed to the SkeletonLoader
SkeletonLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default SkeletonLoader;
