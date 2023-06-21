import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';
import "../../styles/userOrders.css";
import UserNavBar from "../userHeader";

function removeOrder(orderId) {
  return axios.delete(
    `${process.env.REACT_APP_API_HOST}/api/admin/order/${orderId}`,
    {},
    {
      withCredentials: true,
      auth: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );
}

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/user/allOrders`, {
          withCredentials: true,
          auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
          },
        });

        if (response.status === 200) {
          setOrders(response.data);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Remove Order
  const handleRemoveOrder = async (orderId) => {
    setRemoveLoading(true);

    try {
      const response = await removeOrder(orderId);

      if (response.status === 200) {
        alert("Order Removed!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }

    setRemoveLoading(false);
  };

  return (
    <><UserNavBar /><div className="seller-orders-container">

      <h2>Your Orders</h2>

      {isLoading ? (
        <Dimmer active inverted>
          <Loader>Loading orders...</Loader>
        </Dimmer>
      ) : (
        <>
          <Table celled >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Product Name</Table.HeaderCell>
                <Table.HeaderCell>Product Code</Table.HeaderCell>
                <Table.HeaderCell>Selling Price</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Seller ID</Table.HeaderCell>
                <Table.HeaderCell>Order Date</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentOrders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.productName}</Table.Cell>
                  <Table.Cell>{order.productCode}</Table.Cell>
                  <Table.Cell>{order.sellingPrice}</Table.Cell>
                  <Table.Cell>{order.status}</Table.Cell>
                  <Table.Cell>{order.quantity}</Table.Cell>
                  <Table.Cell>{order.sellerId}</Table.Cell>
                  <Table.Cell>{order.orderDate}</Table.Cell>
                  <Table.Cell><button className="ui grey button"
                  onClick={() => handleRemoveOrder(order.id)}
                  disabled={removeLoading}>
                    {removeLoading ? (
                      <Loader active inline size="tiny" />
                    ) : (
                      "Cancel Order"
                    )}</button></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          {orders.length > itemsPerPage && (
            <div className="pagination">
              <button
                className="ui button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="ui button"
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastItem >= orders.length}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div></>
  );
}

export default SellerOrders;
