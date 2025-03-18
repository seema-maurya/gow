import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/OrderList.css";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      selectedProduct: null,
      isEditModalOpen: false,
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/getAll"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }
      const data = await response.json();
      console.log("ORDERLIST", data);
      this.setState({ orders: data.reverse(), loading: false });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      this.setState({ loading: false });
    }
  };

  // handleClick = (orderDetails) => {
  //   this.props.history.push({
  //     pathname: `/payment-info?id=${orderDetails._id}`,
  //     state: { orderDetails },
  //   });
  // };

  handleClick = (orderDetails) => {
    this.setState({ selectedProduct: orderDetails, isEditModalOpen: true });
    console.log(orderDetails);
  };
  handleModalClose = () => {
    this.setState({ isEditModalOpen: false });
  };

  render() {
    const { orders, loading } = this.state;

    return (
      <div className="order-list-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Order List
        </h2>
        <div className="order-details">
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
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/payment-info?id=${order._id}`}>
                        <p
                          style={{ color: "blue" }}
                          onClick={() => this.handleClick(order)}
                        >
                          {order._id}
                        </p>
                      </Link>
                    </td>
                    <td>{order?.InvoiceNumber}</td>
                    <td>{order.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OrderList;
