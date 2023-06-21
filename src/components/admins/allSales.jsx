import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

function useAPIData() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/getSales`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password'),
        },
      })
      .then((response) => {
        setAPIData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return { APIData, setAPIData, loading };
}

function SalesTable() {
  const { APIData, setAPIData, loading } = useAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalSales, setTotalSales] = useState(null);
  const [totalSalesLoading, setTotalSalesLoading] = useState(true);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = APIData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/totalSales`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password'),
        },
      })
      .then((response) => {
        setTotalSales(response.data);
        setTotalSalesLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTotalSalesLoading(false);
      });
  }, []);

  const sortSalesData = () => {
    const sortedData = [...APIData].sort((a, b) => {
      return new Date(a.soldDate) - new Date(b.soldDate);
    });
    setAPIData(sortedData);
  };

  return (
    <div className="float-container">
      <div className="float-child1">
        <h3>
          <u>All Sales</u>
        </h3>
        <div>
          {loading ? (
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          ) : (
            <>
              <Table sortable singleLine>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Sale ID</Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Code</Table.HeaderCell>
                    <Table.HeaderCell>Selling Price</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Seller ID</Table.HeaderCell>
                    <Table.HeaderCell sorted="ascending" onClick={sortSalesData}>
                      Sold Date
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {currentItems.map((data) => {
                    return (
                      <Table.Row key={data.id}>
                        <Table.Cell>{data.id}</Table.Cell>
                        <Table.Cell>{data.productName}</Table.Cell>
                        <Table.Cell>{data.productCode}</Table.Cell>
                        <Table.Cell>{data.sellingPrice}</Table.Cell>
                        <Table.Cell>{data.status}</Table.Cell>
                        <Table.Cell>{data.quantity}</Table.Cell>
                        <Table.Cell>{data.sellerId}</Table.Cell>
                        <Table.Cell>{data.soldDate}</Table.Cell>
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
      <br />
      <h3 className="total-sales">
        Total Sales: Rs.
        {totalSalesLoading ? <Loader active inline size="tiny" /> : totalSales}
      </h3>
    </div>
  );
}

export default SalesTable;
