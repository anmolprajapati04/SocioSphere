async function testReg() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test Admin",
        email: "admin_test_" + Date.now() + "@example.com",
        phone: "1234567890",
        password: "password123",
        role: "Admin",
        society_name: "Test Society",
        society_address: "Test Address",
        city: "Test City",
        flat_number: "A1"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}
testReg();
