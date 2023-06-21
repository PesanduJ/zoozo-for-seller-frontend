import React, { useState, useEffect } from "react";
import { Table, Dimmer, Loader, Modal, Button, Icon } from "semantic-ui-react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/allOrders.css";

function useAPIData() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/allOrders`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      })
      .then((response) => {
        console.log(response?.data);
        setAPIData(response?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { APIData, loading };
}

function completeProduct(orderId) {
  return axios.post(
    `${process.env.REACT_APP_API_HOST}/api/admin/addSale/${orderId}`,
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


function updateOrderStatus(orderId, status) {
  const url = `${process.env.REACT_APP_API_HOST}/api/admin/order/${orderId}`;
  const params = { status };

  const config = {
    withCredentials: true,
    auth: {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    },
    params, // Pass status as a query parameter
  };

  return axios.put(url, null, config);
}

function getSellerDetails(sellerId) {
  return axios.get(
    `${process.env.REACT_APP_API_HOST}/api/user/user/${sellerId}`
  );
}

function OrdersTable() {
  const { APIData, loading } = useAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { id } = useParams();
  const [completeLoading, setCompleteLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [sellerDetailsLoading, setSellerDetailsLoading] = useState(false);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState("ascending");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sellerDetails, setSellerDetails] = useState(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentCustomerDetails, setCurrentCustomerDetails] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");


  // Modal state
  const [showProductModal, setShowProductModal] = useState(false);

  // Selected product details
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch and display product details
  const showProductDetails = async (productCode) => {
    setProductDetailsLoading(true); // Set loading state to true
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/product/${productCode}`,
        {
          withCredentials: true,
          auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
          },
        }
      );
      const data = await response.data;
      setSelectedProduct(data);
      setShowProductModal(true);

    } catch (error) {
      console.log(error);
    } finally {
      setProductDetailsLoading(false); // Set loading state to false after API call completes
    }

  };

  // Fetch and display seller details
  const showSellerDetails = async (sellerId) => {
    setSellerDetailsLoading(true); // Set loading state to true

    try {
      const response = await getSellerDetails(sellerId);

      if (response.status === 200) {
        setSellerDetails(response.data);
        setShowSellerModal(true);
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSellerDetailsLoading(false); // Set loading state to false after API call completes
    }
  };

  // Sort the data by status
  const sortedData = [...APIData].sort((a, b) => {
    const statusOrder = {
      PENDING: 1,
      PROCESSING: 2,
      "IN DELIVERY": 3,
      RETURN: 4,
    };

    if (sortDirection === "ascending") {
      return statusOrder[a.status] - statusOrder[b.status];
    } else {
      return statusOrder[b.status] - statusOrder[a.status];
    }
  });

  // Filter data based on selected status
  const filteredData =
    selectedStatus === "All"
      ? sortedData
      : sortedData.filter((item) => item.status === selectedStatus);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Complete Order
  const handleCompleteOrder = async (productCode) => {
    setCompleteLoading(true);

    try {
      const response = await completeProduct(productCode);

      if (response.status === 200) {
        alert("Order Marked As Completed!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }

    setCompleteLoading(false);
  };

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

  // Update Order Status
  const handleUpdateStatus = async (orderId, status) => {
    setStatusLoading(true);

    try {
      const response = await updateOrderStatus(orderId, status);

      if (response.status === 200) {
        alert("Order Status Updated Successfully!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }

    setStatusLoading(false);
  };


  // Handle status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };


  // Tracking Details Modal
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState("");
  const [trackingDetails, setTrackingDetails] = useState("");
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [isLoadingTrackingDetails, setIsLoadingTrackingDetails] = useState(false);


  // Handle Tracking Details button click
  const handleTrackingDetails = (orderId) => {
    showTrackingDetails(orderId);
    setShowTrackingModal(true);
    setTrackingOrderId(orderId);
  };

  // Handle submit of tracking details
  const handleSubmitTracking = async () => {
    if (trackingDetails.trim() === "") {
      alert("Please enter tracking details.");
      return;
    }
  
    setIsLoadingTracking(true);
  
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('trackingDetails', trackingDetails);
  
      await axios.put(
        `${process.env.REACT_APP_API_HOST}/api/admin/order/tracking/${trackingOrderId}?${queryParams.toString()}`,
        {},
        {
          withCredentials: true,
          auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
          },
        }
      );
  
      alert("Tracking details updated successfully!");
      setShowTrackingModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTracking(false);
    }
  };
  
   // Fetch and display tracking details
   const showTrackingDetails = async (orderId) => {
    setIsLoadingTrackingDetails(true); // Set loading state to true
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/admin/order/${orderId}`,
        {
          withCredentials: true,
          auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
          },
        }
      );
      const data = await response.data.trackingDetails;
      setTrackingDetails(data);
      setShowTrackingModal(true);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTrackingDetails(false); // Set loading state to false after API call completes
    }

  };

  return (
    <div className="layout">
      <div>
        <h3>
          <u>All Orders</u>
        </h3>
        <div>
          {loading ? (
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          ) : (
            <>
              {/* Filtering Option */}
              <div className="filtering-option">
                <label>Filter by Status:&nbsp; </label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  class="ui dropdown"
                >
                  <option value="All">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="IN DELIVERY">In Delivery</option>
                  <option value="RETURN">Return</option>
                </select>
              </div>

              <Table singleLine>
                {/* Table Header */}
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Order ID</Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Code</Table.HeaderCell>
                    <Table.HeaderCell>Selling Price</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Tracking Details</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Seller ID</Table.HeaderCell>
                    <Table.HeaderCell>Commission</Table.HeaderCell>
                    <Table.HeaderCell>Customer Details</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                {/* Table Body */}
                <Table.Body>
                  {currentItems.map((data) => {
                    return (
                      <Table.Row key={data.id}>
                        <Table.Cell>{data.id}</Table.Cell>
                        <Table.Cell>{productDetailsLoading ? (
                          <Loader active inline size="tiny" />
                        ) : (
                          <button
                            className="ui button"
                            onClick={() => showProductDetails(data.productCode)}
                          >
                            {data.productName}
                          </button>
                        )}</Table.Cell>
                        <Table.Cell>{data.productCode}</Table.Cell>
                        <Table.Cell>{data.sellingPrice}</Table.Cell>
                        <Table.Cell>
                          <select
                            value={data.status}
                            onChange={(e) =>
                              handleUpdateStatus(data.id, e.target.value)
                            }
                            disabled={statusLoading}
                            class="ui dropdown"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="IN DELIVERY">IN DELIVERY</option>
                            <option value="RETURN">RETURN</option>
                          </select>
                          {statusLoading && (
                            <Loader active inline size="tiny" />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <button
                            className="ui icon button"
                            onClick={() => handleTrackingDetails(data.id)}
                          >
                            <Icon name="plus" color="green" />
                          </button>
                        </Table.Cell>
                        <Table.Cell>{data.quantity}</Table.Cell>
                        <Table.Cell>
                          {sellerDetailsLoading ? (
                            <Loader active inline size="tiny" />
                          ) : (
                            <button
                              className="ui button"
                              onClick={() => showSellerDetails(data.sellerId)}
                            >
                              {data.sellerId}
                            </button>
                          )}
                        </Table.Cell>
                        <Table.Cell>{data.commission}</Table.Cell>
                        <Table.Cell>
                          <button
                            className="ui button"
                            onClick={() => {
                              setCurrentCustomerDetails(data.customerDetails);
                              setShowCustomerModal(true);
                            }}
                          >
                            View
                          </button>
                        </Table.Cell>

                        <Table.Cell>
                          <button
                            className="ui green button"
                            onClick={() => handleCompleteOrder(data.id)}
                            disabled={completeLoading}
                          >
                            {completeLoading ? (
                              <Loader active inline size="tiny" />
                            ) : (
                              "Mark As Completed"
                            )}
                          </button>
                          <button className="ui grey button"
                          onClick={() => handleRemoveOrder(data.id)}
                          disabled={removeLoading}>
                            {removeLoading ? (
                              <Loader active inline size="tiny" />
                            ) : (
                              "Remove"
                            )}
                          </button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>

              {/* Pagination */}
              <div>
                {filteredData.length > itemsPerPage && (
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
                      disabled={indexOfLastItem >= filteredData.length}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Seller Details Modal */}
      {showSellerModal && (
        <Modal open={showSellerModal} onClose={() => setShowSellerModal(false)}>
          <Modal.Header>Seller Details</Modal.Header>
          <Modal.Content>
            {sellerDetailsLoading ? (
              <Loader active inline="centered" size="small" />
            ) : (
              <div>
                <p>
                  <strong>NIC:</strong> {sellerDetails.nic}
                </p>
                <p>
                  <strong>Username:</strong> {sellerDetails.username}
                </p>
                <p>
                  <strong>Mobile Number:</strong> {sellerDetails.mobileNo}
                </p>
                <p>
                  <strong>Bank Details:</strong> {sellerDetails.bankDetails}
                </p>
                <p>
                  <strong>Role:</strong> {sellerDetails.role}
                </p>
              </div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              inverted
              color="green"
              onClick={() => setShowSellerModal(false)}
            >
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {/* Customer Details Modal */}
      {showCustomerModal && (
        <Modal
          open={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
        >
          <Modal.Header>Customer Details</Modal.Header>
          <Modal.Content>
            <div>
              <p>
                <strong>Name:</strong>{" "}
                {currentCustomerDetails
                  ? currentCustomerDetails.split(";")[0]
                  : ""}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {currentCustomerDetails
                  ? currentCustomerDetails.split(";")[1]
                  : ""}
              </p>
              <p>
                <strong>Telephone Number:</strong>{" "}
                {currentCustomerDetails
                  ? currentCustomerDetails.split(";")[2]
                  : ""}
              </p>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              inverted
              color="green"
              onClick={() => setShowCustomerModal(false)}
            >
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {/* Product Details Modal */}
      {showProductModal && (
        <Modal
          open={showProductModal}
          onClose={() => setShowProductModal(false)}
        >
          <Modal.Header>Product Details</Modal.Header>
          <Modal.Content>
            {selectedProduct ? (
              <div>
                <div><h3>ID: {selectedProduct.productCode}</h3></div>
                <div><h3>Name: {selectedProduct.productName}</h3></div>
                <div><h3>Price: {selectedProduct.sellingPrice}</h3></div>
                <img
                  src={selectedProduct.imageKey}
                  alt={selectedProduct.productName}
                  style={{ width: "100%", height: "40%", border: '1px solid #ccc', objectFit: 'contain', borderRadius: '5%' }}
                />
              </div>
            ) : (
              <div>Loading product details...</div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              inverted
              color="green"
              onClick={() => setShowProductModal(false)}
            >
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {/* Tracking Details Modal */}
      <Modal
        open={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      >
        <Modal.Header>Enter Tracking Details</Modal.Header>
        <Modal.Content>
        {isLoadingTrackingDetails ? (
      <Loader active inline="centered" size="small" />
    ) : (
      <textarea
        rows="10"
        value={trackingDetails}
        onChange={(e) => setTrackingDetails(e.target.value)}
        style={{ width: '100%' }}
      />
    )}
        </Modal.Content>
        <Modal.Actions>
        <Button color="black"  onClick={() => setShowTrackingModal(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSubmitTracking} loading={isLoadingTracking}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default OrdersTable;
