import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/LoginRecords.css";
import Pagination from "./Pagination/Pagination";

const LoginRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterEmail, setFilterEmail] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "user/loginRecords"
        );
        console.log(response.data);
        setRecords(response.data.reverse());
        setFilteredRecords(response.data); // Set filtered records to all records initially
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch login records. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecords();
    const interval = setInterval(() => {
      fetchRecords();
    }, 500000);
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  useEffect(() => {
    const newFilteredRecords = records.filter(
      (record) =>
        record.email.toLowerCase().includes(filterEmail.toLowerCase()) ||
        record.userId.toLowerCase().includes(filterEmail.toLowerCase())
    );
    setFilteredRecords(newFilteredRecords);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [filterEmail, records]);

  const handleFilterChange = (e) => {
    setFilterEmail(e.target.value.trim());
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDuration = (ms) => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const formattedDays = days > 0 ? `${days}d ` : "";
    const formattedHours = hours % 24 > 0 ? `${hours % 24}h ` : "";
    const formattedMinutes = minutes % 60 > 0 ? `${minutes % 60}m ` : "";
    const formattedSeconds = seconds % 60 > 0 ? `${seconds % 60}s` : "";

    return `${formattedDays}${formattedHours}${formattedMinutes}${formattedSeconds}`;
  };

  const RecordRow = React.memo(({ record }) => (
    <tr key={record._id}>
      <td style={{ color: !record.logoutTime ? "green" : "" }}>
        <div className="user-id-container">
          {record.userId}({record.loginCount})
          {!record.logoutTime && <span className="active-dot"></span>}
        </div>
      </td>
      <td>{record.email}</td>
      <td>
        {record.device.family}, {record.device.model}
      </td>
      <td>{new Date(record.loginTime).toLocaleString()}</td>
      <td>
        {record.logoutTime
          ? new Date(record.logoutTime).toLocaleString()
          : "N/A"}
      </td>
      <td>{formatDuration(record.totalDuration)}</td>
    </tr>
  ));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const currentRecords = filteredRecords.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="feedback-list">
      <h3
        style={{
          backgroundColor: "blanchedalmond",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filter by E-mail and User ID"
            value={filterEmail}
            onChange={handleFilterChange}
          />
        </div>
        <div className="sliding-header-container">
          <strong className="sliding-header">Login Records</strong>
        </div>
      </h3>
      {filteredRecords.length === 0 && filterEmail ? (
        <h3>
          No Data Found for <strong>"{filterEmail}"</strong>
        </h3>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Device, OS</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Total Duration</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <RecordRow key={record._id} record={record} />
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredPaymentInfo={filteredRecords}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default LoginRecords;
