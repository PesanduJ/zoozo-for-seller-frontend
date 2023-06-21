import React, { useState } from 'react';
import { Button, Form, Dimmer, Loader } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/registrationPage.css';

function RegistrationForm() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/');
  };

  const [loading, setLoading] = useState(false);
  const [nic, setNic] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [role, setRole] = useState('USER');

  async function postData(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/user/addUser`,
        {
          nic,
          username,
          password,
          mobileNo,
          bankDetails,
          role,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('User Registration Is Successful!');
        setNic('');
        setUsername('');
        setPassword('');
        setMobileNo('');
        setBankDetails('');
        setRole('');

        handleRegister();
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="create-user-form">
        <h3>User Registration Portal</h3>
        <Form>
          <Form.Field>
            <label>National Identity Card Number</label>
            <input placeholder="NIC" onChange={(e) => setNic(e.target.value)} />
          </Form.Field>

          <Form.Field>
            <label>User Name</label>
            <input placeholder="User Name" onChange={(e) => setUsername(e.target.value)} />
          </Form.Field>

          <Form.Field>
            <label>Password</label>
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Field>

          <Form.Field>
            <label>Mobile No.</label>
            <input placeholder="Mobile No." type="number" onChange={(e) => setMobileNo(e.target.value)} />
          </Form.Field>

          <Form.Field>
            <label>Bank Details</label>
            <textarea onChange={(e) => setBankDetails(e.target.value)}></textarea>
          </Form.Field>

          <Button type="submit" onClick={postData} disabled={loading}>
            {loading ? (
              <Dimmer active inverted>
                <Loader>Processing</Loader>
              </Dimmer>
            ) : (
              'Register'
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RegistrationForm;
