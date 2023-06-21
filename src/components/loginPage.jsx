import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/checkUserRole?username=${username}&password=${password}`
      );

      if (response.status === 200) {
        const data = response.data;

        if (data === 'USER') {
          // Save credentials to localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);

          // Redirect to user dashboard
          window.location.href = '/user-dashboard';
        } else if (data === 'ADMIN') {
          // Save credentials to localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);

          // Redirect to admin home
          window.location.href = '/admin-home';
        } else {
          // Invalid username or password
          setUsername('');
          setPassword('');
          setError('Invalid username or password.');
        }
      } else {
        // Handle non-200 response
        setUsername('');
        setPassword('');
        setError('An error occurred. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
      <div className="ui middle aligned center aligned grid">
        <div className="column" style={{ maxWidth: '420px' }}>
          <h2 className="ui teal image header">
            <div className="content">Log in to your account</div>
          </h2>
          <Form size="large" error={!!error}>
            <Form.Input
              icon="user"
              iconPosition="left"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              icon="lock"
              iconPosition="left"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Message error content={error} />}
            <Button fluid size="large" color="teal" onClick={handleLogin} loading={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Form>
          <Message>
            New to us? <a href="/user-registration">Register</a>
          </Message>
        </div>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
    </div>
  );
}

export default LoginPage;
