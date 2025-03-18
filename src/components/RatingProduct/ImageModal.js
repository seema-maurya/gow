import React, { useEffect, useRef } from "react";
import "./ImageModal.css"; // Optional for styling

const ImageModal = ({ images, currentIndex, onClose }) => {
  const modalRef = useRef(); // Create a ref for the modal

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onClose(newIndex); // Update to the new index
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % images.length;
    onClose(newIndex); // Update to the new index
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(-1); // Close modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="image-modal-overlay" onClick={() => onClose(-1)}>
      <div
        className="image-modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="image-modal-close" onClick={() => onClose(-1)}>
          &times;
        </span>
        {images.length > 0 && (
          <div
            className="image-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-arrow left"
              onClick={(e) => {
                e.preventDefault();
                handlePrev(e); // Navigate to the previous image
              }}
            >
              &lt;
            </button>
            {images[currentIndex]?.type?.startsWith("image") && (
              <img
                className="image-modal-image"
                src={images[currentIndex].filePath || null}
                alt="user review"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {images[currentIndex]?.type?.startsWith("video") && (
              <video controls className="image-modal-image">
                <source
                  src={images[currentIndex].filePath || null}
                  type={images[currentIndex].type}
                />
              </video>
            )}
            {/* onClick={handleNext}> */}
            <button
              className="image-modal-arrow right"
              onClick={(e) => {
                e.preventDefault();
                handleNext(e);
              }}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
