import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaEnvelope,
  FaCalendarAlt,
  FaComments,
  FaUserCog,
  FaTrash,
} from "react-icons/fa";
import "../css/Feedback.css";
import FeedbackDeleteConfirmationPopup from "./FeedbackDeleteConfirmationPopup";
import Pagination from "./Pagination/Pagination";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    index: null,
    confirmationText: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const popupRef = useRef();

  const handleItemsPerPageChange = (e) => {
    const itemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteConfirmation = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;

    setDeleteConfirmation({
      isOpen: true,
      index: actualIndex,
      confirmationText: "",
    });
  };

  const handleConfirmationInputChange = (e) => {
    setDeleteConfirmation((prev) => ({
      ...prev,
      confirmationText: e.target.value,
    }));
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      index: null,
      confirmationText: "",
    });
  };

  const handleDeleteConfirm = async () => {
    const { confirmationText, index } = deleteConfirmation;

    if (confirmationText === "Delete") {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}feedback/deleteFeedback/${feedbackList[index]._id}`
        );

        if (response.status === 200) {
          const updatedFeedbackList = [...feedbackList];
          updatedFeedbackList.splice(index, 1);
          setFeedbackList(updatedFeedbackList);
          const totalPagesAfterDeletion = Math.ceil(
            updatedFeedbackList.length / itemsPerPage
          );
          if (currentPage > totalPagesAfterDeletion) {
            setCurrentPage(totalPagesAfterDeletion); // Stay on the last valid page
          }
          setDeleteConfirmation({
            isOpen: false,
            index: null,
            confirmationText: "",
          });
          toast.success("Feedback deleted successfully.");
        } else {
          toast.error("Failed to delete feedback.");
        }
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error("Failed to delete feedback.");
      }
    } else {
      toast.error("Please type 'Delete' to confirm deletion.");
    }
  };

  const fetchFeedback = async (isAdmin) => {
    try {
      let response;
      if (isAdmin) {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}feedback/getAllFeedback?admin=true&userEmail=${userEmail}`
        );
      } else {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}feedback/getAllFeedback?admin=false&userEmail=${userEmail}`
        );
      }
      console.log(response);
      const sortedFeedback = response.data.reverse();
      setFeedbackList(sortedFeedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const name = localStorage.getItem("userName");

    if (email) {
      setUserEmail(email);
      setIsAdmin(adminStatus);
      setUserName(name);
    }
    fetchFeedback(adminStatus);

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleDeleteCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(feedbackList.length / itemsPerPage);
  const currentItems = feedbackList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="feedback-list">
      <table>
        <thead>
          <tr>
            <th style={{ backgroundColor: "black" }}>
              {isAdmin && <FaUserCog />} Admin
            </th>
            <td>
              {isAdmin && (
                <label className="feedback-label">
                  {userName} : {userEmail}
                </label>
              )}
            </td>
          </tr>
        </thead>
      </table>
      <table>
        <thead>
          <tr>
            <th>
              <FaEnvelope style={{ color: "" }} />
              {"  "}
              User Email
            </th>
            <th className="date-header">
              <FaCalendarAlt style={{ color: "" }} />
              {"  "}Date
            </th>
            <th>
              <FaComments style={{ color: "" }} /> Feedback
            </th>
            <th>
              <FaTrash />
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((feedback, index) => (
            <tr key={index}>
              <td className="mobile feedbackmail">
                {feedback.userEmail && feedback.userEmail}
              </td>
              <td className="date-header feedbackmail">{feedback.createdAt}</td>
              <td className="mobile mobiles ">
                {feedback.feedback.length > 30 ? (
                  <p className="horizontal-scroll" title={feedback.feedback}>
                    {feedback.feedback}
                  </p>
                ) : (
                  feedback.feedback
                )}
              </td>
              <td>
                <FaTrash
                  onClick={() => handleDeleteConfirmation(index)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {feedbackList.length > 0 && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredPaymentInfo={feedbackList}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
      <div ref={popupRef}>
        <FeedbackDeleteConfirmationPopup
          isOpen={deleteConfirmation.isOpen}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          onInputChange={handleConfirmationInputChange}
        />
      </div>
    </div>
  );
};

export default Feedback;
