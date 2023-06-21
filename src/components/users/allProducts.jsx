import React, { useState, useEffect } from "react";
import {
  Table,
  Dimmer,
  Loader,
  Modal,
  Button,
  Form,
  Message,
} from "semantic-ui-react";
import axios from "axios";

function useAPIData() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request

    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/allProducts`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setAPIData(data);
        setLoading(false); // Set loading to false when the API request is completed
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  return { APIData, loading };
}

function UserProductsTable() {
  const { APIData, loading } = useAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = APIData.slice(indexOfFirstItem, indexOfLastItem);

  const [orderAmounts, setOrderAmounts] = useState(() => {
    const initialOrderAmounts = Array(APIData.length).fill(0);
    return initialOrderAmounts;
  });

  const [ordering, setOrdering] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [commission, setCommission] = useState(() => {
    const initialCommission = Array(APIData.length).fill(0);
    return initialCommission;
  });

  const handleOrderAmountChange = (event, index) => {
    const newOrderAmounts = [...orderAmounts];
    newOrderAmounts[index] = parseInt(event.target.value, 10);
    setOrderAmounts(newOrderAmounts);
  };

  const handleCommissionChange = (event, index) => {
    const newCommission = [...commission];
    newCommission[index] = parseFloat(event.target.value);
    setCommission(newCommission);
  };

  const handleOrderClick = (productCode, quantity, commission) => {
    setProductCode(productCode);
    setQuantity(quantity);
    setCommission(commission);
    setModalOpen(true);
    setCustomerDetails({
      name: "",
      address: "",
      phoneNumber: "",
    });
    setShowError(false);
  };

  const handleConfirmOrder = () => {
    if (
      !customerDetails.name ||
      !customerDetails.address ||
      !customerDetails.phoneNumber
    ) {
      setShowError(true);
      return;
    }

    setOrdering(true);
    const customerInfo = `${customerDetails.name};${customerDetails.address};${customerDetails.phoneNumber}`;
    const url = `${process.env.REACT_APP_API_HOST}/api/user/addOrder/${productCode}?quantity=${quantity}&commission=${commission}&customerDetails=${customerInfo}`;

    // Perform the order logic here
    axios
      .post(url, null, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      })
      .then((response) => {
        // Handle the response data if needed
        console.log(response.data);
        setOrdering(false);
        setModalOpen(false);
        setOrderSuccess(true);
        setTimeout(() => {
          setOrderSuccess(false);
        }, 1500);
      })
      .catch((error) => {
        // Handle any error that occurs during the order process
        console.error(error);
        setOrdering(false);
        setModalOpen(false);
      });
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (modalOpen) {
      setCustomerDetails({
        name: "",
        address: "",
        phoneNumber: "",
      });
      setShowError(false);
    }
  }, [modalOpen]);

  const handleCustomerDetailsChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filteredItems = APIData.filter((data) =>
    data.productName.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredCurrentItems = filteredItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div>
      <h3>
        <u>All Products</u>
      </h3>
      <div>
        {loading ? (
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <>
            {ordering && (
              <Dimmer active inverted>
                <Loader>Ordering...</Loader>
              </Dimmer>
            )}

            {orderSuccess && (
              <Message positive>
                <Message.Header>Order Successful!</Message.Header>
                <p>Your order has been placed successfully.</p>
              </Message>
            )}

            <div style={{ marginBottom: "10px" }}>
            <p>Filter by:  &nbsp;
              <input
                type="text"
                placeholder="Product Name"
                value={filter}
                onChange={handleFilterChange}
              /> </p>
            </div>

            <Table singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product Code</Table.HeaderCell>
                  <Table.HeaderCell>Product Image</Table.HeaderCell>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Selling Price</Table.HeaderCell>
                  <Table.HeaderCell>In Stock</Table.HeaderCell>
                  <Table.HeaderCell>Product Value</Table.HeaderCell>
                  <Table.HeaderCell>Order</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {filteredCurrentItems.map((data, index) => {
                  return (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.productCode}</Table.Cell>
                      <Table.Cell>
                        <div className="image-container">
                          <img
                            src={data.imageKey}
                            alt={data.name}
                            style={{
                              width: "50%",
                              height: "50%",
                              border: "1px solid #ccc",
                              objectFit: "cover",
                              borderRadius: "5%",
                            }} // Set the desired width and height
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>{data.productName}</Table.Cell>
                      <Table.Cell>{data.description}</Table.Cell>
                      <Table.Cell>{data.sellingPrice}</Table.Cell>
                      <Table.Cell>{data.inStock}</Table.Cell>
                      <Table.Cell>{data.productValue}</Table.Cell>
                      <Table.Cell>
                        <input
                          type="number"
                          placeholder="Commission"
                          value={commission[index]}
                          onChange={(event) =>
                            handleCommissionChange(event, index)
                          }
                          style={{ width: "100px" }} // Adjust the width value as needed
                        />
                        &nbsp;
                        &nbsp;
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={orderAmounts[index]}
                          onChange={(event) =>
                            handleOrderAmountChange(event, index)
                          }
                          style={{ width: "80px" }} // Adjust the width value as needed
                        />
                        &nbsp;
                        &nbsp;
                        <button
                          className="ui inverted green button"
                          disabled={
                            orderAmounts[index] === 0 ||
                            !orderAmounts[index] ||
                            ordering
                          }
                          onClick={() =>
                            handleOrderClick(
                              data.productCode,
                              orderAmounts[index],
                              commission[index]
                            )
                          }
                        >
                          Order
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>

            {filteredItems.length > itemsPerPage && (
              <div className="pagination">
                <button
                  className="ui button"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.ceil(filteredItems.length / itemsPerPage) },
                  (_, index) => (
                    <button
                      className={`ui button ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  )
                )}
                <button
                  className="ui button"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredItems.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="tiny"
        centered
      >
        <Modal.Header>Confirm Order</Modal.Header>
        <Modal.Content>
          <div>
            <Form>
              <Form.Field>
                <label>Name</label>
                <input
                  placeholder="Name"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleCustomerDetailsChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <input
                  placeholder="Address"
                  name="address"
                  value={customerDetails.address}
                  onChange={handleCustomerDetailsChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Phone Number</label>
                <input
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={customerDetails.phoneNumber}
                  onChange={handleCustomerDetailsChange}
                />
              </Form.Field>
              {showError && (
                <Message negative>
                  <Message.Header>Error</Message.Header>
                  <p>Please fill in all the required fields.</p>
                </Message>
              )}
            </Form>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => setModalOpen(false)}
            disabled={ordering}
          >
            Cancel
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Confirm"
            onClick={handleConfirmOrder}
            loading={ordering}
            disabled={ordering}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default UserProductsTable;
