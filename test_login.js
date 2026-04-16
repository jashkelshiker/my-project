const axios = require('axios');

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

async function testLogin() {
  try {
    const resp = await axios.post(
      `${API_BASE_URL}/token/`,
      { username: 'doesnotexist', password: 'x' },
      {
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:3001',
        },
        timeout: 5000,
      }
    );
    console.log('Status:', resp.status);
    console.log('Data:', resp.data);
  } catch (err) {
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('No response received. Request details:');
      console.error(err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
    console.error('Full error:', err.toString());
  }
}

testLogin();
