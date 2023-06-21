import React, { useState, useEffect } from "react";
import { Table, Dimmer, Loader } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/productImage.css";

function useAPIData() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/allProducts`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setAPIData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { APIData, loading };
}

function deleteProduct(productCode) {
  return axios.delete(
    `${process.env.REACT_APP_API_HOST}/api/admin/product/${productCode}`,
    {
      withCredentials: true,
      auth: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );
}

function ProductsTable() {
  const { APIData, loading } = useAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = APIData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Delete product
  const handleDelete = async (productCode) => {
    setDeleteLoading(true);

    try {
      const response = await deleteProduct(productCode);

      if (response.status === 200) {
        alert("Product deleted successfully!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }

    setDeleteLoading(false);
  };

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
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {currentItems.map((data) => {
                  return (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.productCode}</Table.Cell>
                      <Table.Cell>
                        <div className="image-container">
                          <img
                            src={data.imageKey}
                            alt={data.name}
                            style={{ width: "100%", height: "100%", border: '1px solid #ccc', objectFit: 'cover', borderRadius: '5%'}} // Set the desired width and height
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>{data.productName}</Table.Cell>
                      <Table.Cell>{data.description}</Table.Cell>
                      <Table.Cell>{data.sellingPrice}</Table.Cell>
                      <Table.Cell>{data.inStock}</Table.Cell>
                      <Table.Cell>{data.productValue}</Table.Cell>
                      <Table.Cell>
                        <button
                          className="ui inverted green button"
                          onClick={() =>
                            navigate(`/update-product/${data.productCode}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="ui inverted red button"
                          onClick={() => handleDelete(data.productCode)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <Dimmer active inverted>
                              <Loader>Removing</Loader>
                            </Dimmer>
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
              {APIData.length > itemsPerPage && (
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
                    disabled={indexOfLastItem >= APIData.length}
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
  );
}

export default ProductsTable;
