const axios = require('axios');

async function testReg() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: "Test Admin",
      email: "admin_test_" + Date.now() + "@example.com",
      phone: "1234567890",
      password: "password123",
      role: "Admin",
      society_name: "Test Society",
      society_address: "Test Address",
      city: "Test City",
      flat_number: "A1"
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error Status:", err.response.status);
      console.log("Error Data:", err.response.data);
    } else {
      console.log("Request Error:", err.message);
    }
  }
}
testReg();
