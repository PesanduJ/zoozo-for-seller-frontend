import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';
import '../../styles/topSellers.css';

function TopSellers() {
  const [topSellers, setTopSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      setIsLoading(true);

      const salesResponse = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/getSales`, {
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password'),
        },
      });

      if (salesResponse.status === 200) {
        const sales = salesResponse.data;

        // Calculate total points for each seller
        const sellerPointsMap = {};

        for (const sale of sales) {
          const sellerId = sale.sellerId;

          if (!sellerPointsMap[sellerId]) {
            sellerPointsMap[sellerId] = {
              sellerId: sellerId,
              totalPoints: 0,
            };
          }

          const productValueResponse = await axios.get(
            `${process.env.REACT_APP_API_HOST}/api/user/pointsBySeller?productCode=${sale.productCode}`,
            {
              withCredentials: true,
              auth: {
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
              },
            }
          );

          if (productValueResponse.status === 200) {
            const productValueData = productValueResponse.data;
            const productValue = parseFloat(productValueData);
            const points = productValue * sale.quantity;
            sellerPointsMap[sellerId].totalPoints += points;
          } else {
            console.error('Error fetching product value:', productValueResponse.statusText);
          }

          // Fetch seller's name by ID
          const sellerNameResponse = await axios.get(`${process.env.REACT_APP_API_HOST}/api/user/user/${sellerId}`, {
            withCredentials: true,
            auth: {
              username: localStorage.getItem('username'),
              password: localStorage.getItem('password'),
            },
          });

          if (sellerNameResponse.status === 200) {
            const sellerData = sellerNameResponse.data;
            sellerPointsMap[sellerId].name = sellerData.username;
          } else {
            console.error("Error fetching seller's name:", sellerNameResponse.statusText);
          }
        }

        // Sort sellers based on total points and get top 10
        const sortedSellers = Object.values(sellerPointsMap).sort((a, b) => b.totalPoints - a.totalPoints);
        const topSellers = sortedSellers.slice(0, 10);

        setTopSellers(topSellers);
      } else {
        throw new Error(salesResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching top sellers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>
        <u>Top Sellers</u>
      </h2>
      {isLoading ? (
        <Dimmer active inverted>
          <Loader>Loading top sellers...</Loader>
        </Dimmer>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User Name</Table.HeaderCell>
              <Table.HeaderCell>Total Points</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topSellers.map((seller, index) => (
              <Table.Row
                key={seller.sellerId}
                className={
                  index === 0 ? 'highlighted1' : index === 1 ? 'highlighted2' : index === 2 ? 'highlighted3' : ''
                }
              >
                <Table.Cell>{seller.name}</Table.Cell>
                <Table.Cell>{seller.totalPoints}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}

export default TopSellers;
