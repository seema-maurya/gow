import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/OrderList.css";
import Pagination from "./Pagination/Pagination";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/getOrderList"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }
      const data = await response.json();
      console.log("ORDERLIST", data);
      setOrders(data.reverse());

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setLoading(false);
    }
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="order-list-container">
      {/* <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Order List</h2> */}
      <h2>Order List</h2>

      <div className="order-details">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SR.NO</th>
                <th>Order ID</th>
                <th>InvoiceNo</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : (
                currentItems.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        to={`/payment-info?id=${order._id}`}
                        className="order-link"
                      >
                        <p style={{ color: "blue" }}>{order._id}</p>
                      </Link>
                    </td>
                    <td>{order?.InvoiceNumber}</td>
                    <td>{order.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        filteredPaymentInfo={orders}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default OrderList;
