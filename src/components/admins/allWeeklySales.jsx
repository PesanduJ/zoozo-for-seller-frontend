import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

const WeeklySalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customSalesValue, setCustomSalesValue] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellerId, setSellerId] = useState('');
  const [productCode, setProductCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/admin/getCustomSales?startDate=${startDate}&endDate=${endDate}`,
          {
            withCredentials: true,
            auth: {
              username: localStorage.getItem('username'),
              password: localStorage.getItem('password'),
            },
          }
        );

        if (response.status === 200) {
          setSalesData(response.data);
        } else {
          throw new Error('Failed to fetch custom sales data');
        }
      } catch (error) {
        console.error(error);
        setSalesData([]);
      }

      setIsLoading(false);
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchCustomSalesValue = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/admin/customSales?startDate=${startDate}&endDate=${endDate}`,
          {
            withCredentials: true,
            auth: {
              username: localStorage.getItem('username'),
              password: localStorage.getItem('password'),
            },
          }
        );

        if (response.status === 200) {
          setCustomSalesValue(response.data);
        } else {
          throw new Error('Failed to fetch custom sales value');
        }
      } catch (error) {
        console.error(error);
        setCustomSalesValue('');
      }

      setIsLoading(false);
    };

    if (startDate && endDate) {
      fetchCustomSalesValue();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSellerIdChange = (event) => {
    setSellerId(event.target.value);
  };

  const handleProductCodeChange = (event) => {
    setProductCode(event.target.value);
  };

  const filterSalesBySellerIdAndProductCode = (sales) => {
    if (sellerId && productCode) {
      return sales.filter(
        (sale) => sale.sellerId === sellerId && sale.productCode === productCode
      );
    } else if (sellerId) {
      return sales.filter((sale) => sale.sellerId === sellerId);
    } else if (productCode) {
      return sales.filter((sale) => sale.productCode === productCode);
    }
    return sales;
  };

  const filteredSalesData = filterSalesBySellerIdAndProductCode(salesData);

  const calculateTotalSellingPrice = () => {
    if (filteredSalesData.length > 0) {
      return filteredSalesData.reduce(
        (totalSellingPrice, sale) => totalSellingPrice + sale.sellingPrice,
        0
      );
    }
    return 0;
  };

  const calculateTotalCommission = () => {
    if (filteredSalesData.length > 0) {
      return filteredSalesData.reduce((totalCommission, sale) => totalCommission + sale.commission, 0);
    }
    return 0;
  };

  return (
    <div>
      <h3>
        <u>Sort Your Sales</u>
      </h3>
      <b>Start Date : </b>
      <input type="date" value={startDate} onChange={handleStartDateChange} placeholder="Start Date" />
      <br />
      <b>End Date : </b>
      <input type="date" value={endDate} onChange={handleEndDateChange} placeholder="End Date" />
      <br />
      <br />
      <b>Seller ID: </b>
      <input type="text" value={sellerId} onChange={handleSellerIdChange} placeholder="Seller ID" />
      &nbsp; &nbsp; &nbsp;
      <b>Product Code: </b>
      <input type="text" value={productCode} onChange={handleProductCodeChange} placeholder="Product Code" />
      <br />
      <br />
      {isLoading ? (
        <Dimmer active>
          <Loader>Loading Sales Data</Loader>
        </Dimmer>
      ) : (
        <div>
          {filteredSalesData.length > 0 ? (
            <Table sortable celled>
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
                {filteredSalesData.map((sale) => (
                  <Table.Row key={sale.id}>
                    <Table.Cell>{sale.id}</Table.Cell>
                    <Table.Cell>{sale.productName}</Table.Cell>
                    <Table.Cell>{sale.productCode}</Table.Cell>
                    <Table.Cell>{sale.sellingPrice}</Table.Cell>
                    <Table.Cell>{sale.status}</Table.Cell>
                    <Table.Cell>{sale.quantity}</Table.Cell>
                    <Table.Cell>{sale.sellerId}</Table.Cell>
                    <Table.Cell>{sale.commission}</Table.Cell>
                    <Table.Cell>{sale.soldDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>
              <b>No sales data available</b>
            </p>
          )}
        </div>
      )}
      <br />
      <br />
      <h3>
        Sorted Sales Value: Rs.{' '}
        {isLoading ? <Loader active inline size="tiny" /> : calculateTotalSellingPrice()}
      </h3>
      <h3>
        Total Seller Commission: Rs.{' '}
        {isLoading ? <Loader active inline size="tiny" /> : calculateTotalCommission()}
      </h3>
    </div>
  );
};

export default WeeklySalesTable;
