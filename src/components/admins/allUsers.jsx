import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

function useAPIData() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/admin/allUsers`, {
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

  return { APIData, loading };
}

function removeUser(nic) {
  return axios.delete(
    `${process.env.REACT_APP_API_HOST}/api/admin/remove/user/${nic}`,
    {
      withCredentials: true,
      auth: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );
}

function banUser(nic) {
  return axios.put(
    `${process.env.REACT_APP_API_HOST}/api/admin/ban/user/${nic}`,
    {
      withCredentials: true,
      auth: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );
}

function UsersTable() {
  const { APIData, loading } = useAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const itemsPerPage = 5;

  const handleBanUser = async (nic) => {
    setBanLoading(true);
  
    try {
      const response = await banUser(nic);
  
      if (response.status === 200) {
        alert("Admin Banned!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }
  
    setBanLoading(false);
  };

  const handleRemoveUser = async (nic) => {
    setDeleteLoading(true);
  
    try {
      const response = await removeUser(nic);
  
      if (response.status === 200) {
        alert("Admin removed successfully!");
        window.location.reload(); // Refresh the page
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }
  
    setDeleteLoading(false);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = APIData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h3>All Users</h3>
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
                  <Table.HeaderCell>NIC</Table.HeaderCell>
                  <Table.HeaderCell>User Name</Table.HeaderCell>
                  <Table.HeaderCell>Mobile No</Table.HeaderCell>
                  <Table.HeaderCell>Bank Details</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {currentItems.map((data) => {
                  return (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.nic}</Table.Cell>
                      <Table.Cell>{data.username}</Table.Cell>
                      <Table.Cell>{data.mobileNo}</Table.Cell>
                      <Table.Cell><pre>{data.bankDetails}</pre></Table.Cell>
                      <Table.Cell>{data.role}</Table.Cell>
                      <Table.Cell>
                        <button className="ui grey button" onClick={() => handleBanUser(data.nic)}>{banLoading ? (
                            <Dimmer active inverted>
                              <Loader>Banning the Admin</Loader>
                            </Dimmer>
                          ) : (
                            "Ban"
                          )}</button>
                        <button className="ui red button" 
                        onClick={() => handleRemoveUser(data.nic)}>{deleteLoading ? (
                            <Dimmer active inverted>
                              <Loader>Removing</Loader>
                            </Dimmer>
                          ) : (
                            "Remove"
                          )}</button>
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
                  <button className="ui button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
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

export default UsersTable;
