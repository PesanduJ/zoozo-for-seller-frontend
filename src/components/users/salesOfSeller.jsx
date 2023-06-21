import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

function SalesBySellerId() {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchSalesData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/user/salesBySellerId`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username') || '',
          password: localStorage.getItem('password') || '',
        },
      });

      if (response.status === 200) {
        const sales = response.data;

        const updatedSalesData = await Promise.all(
          sales.map(async (sale) => {
            try {
              const productValueResponse = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/user/pointsBySeller?productCode=${sale.productCode}`,
                {
                  withCredentials: true,
                  auth: {
                    username: localStorage.getItem('username') || '',
                    password: localStorage.getItem('password') || '',
                  },
                }
              );

              if (productValueResponse.status === 200) {
                const productValueData = productValueResponse.data;
                const productValue = parseFloat(productValueData);
                const points = productValue * sale.quantity;
                return { ...sale, productValue, points };
              } else {
                console.error('Error fetching product value:', productValueResponse.statusText);
              }
            } catch (error) {
              console.error('Error fetching product value:', error);
            }
          })
        );

        setSalesData(updatedSalesData);
        calculateTotalPoints(updatedSalesData);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []); // Empty dependency array to run the effect only once

  const calculateTotalPoints = (sales) => {
    const total = sales.reduce((acc, sale) => acc + sale.points, 0);
    setTotalPoints(total);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>
        <u>Your Sales</u>
        <h1>Total Points Earned! : {totalPoints}</h1>
      </h2>

      {isLoading ? (
        <Dimmer active inverted>
          <Loader>Loading sales data...</Loader>
        </Dimmer>
      ) : (
        <Table celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Product Name</Table.HeaderCell>
              <Table.HeaderCell>Product Code</Table.HeaderCell>
              <Table.HeaderCell>Selling Price</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Seller ID</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
              <Table.HeaderCell>Sold Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentItems.map((sale) => (
              <Table.Row key={sale?.id}>
                <Table.Cell>{sale.orderId}</Table.Cell>
                <Table.Cell>{sale.productName}</Table.Cell>
                <Table.Cell>{sale.productCode}</Table.Cell>
                <Table.Cell>{sale.sellingPrice}</Table.Cell>
                <Table.Cell>{sale.status}</Table.Cell>
                <Table.Cell>{sale.quantity}</Table.Cell>
                <Table.Cell>{sale.sellerId} </Table.Cell>
                <Table.Cell>{sale.commission} </Table.Cell>
                <Table.Cell>{sale.soldDate}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {salesData.length > itemsPerPage && (
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
            disabled={indexOfLastItem >= salesData.length}
          >
            Next
          </button>
        </div>
      )}

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default SalesBySellerId;
