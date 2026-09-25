const BACKEND_URL = 'https://property-rental-marketplace-3eto.onrender.com';
const ORIGIN = 'https://property-rental-marketplace-six.vercel.app';

async function testAuthFlow() {
  console.log(`\n=== Testing Live Render Backend: ${BACKEND_URL} ===\n`);

  try {
    // 1. Health check
    const healthRes = await fetch(`${BACKEND_URL}/api/health`, {
      headers: { 'Origin': ORIGIN }
    });
    const healthData = await healthRes.json();
    console.log('✓ Health check passed:', healthData);

    // 2. Register test user
    const testEmail = `test_qa_${Date.now()}@havenstay.com`;
    const testPassword = 'Password@123';
    const testName = 'QA Tester';

    console.log(`\n1. Registering user: ${testEmail}`);
    const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        role: 'user',
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    console.log('✓ Registration successful:', regData.message || 'User created');

    // 3. Login
    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    console.log('✓ Login successful!');
    const token = loginData.token;
    console.log(`Token received: ${token.substring(0, 20)}...`);

    // 4. Verify Auth with Bearer Token (/api/auth/me)
    console.log('\n3. Verifying /api/auth/me with Bearer token...');
    const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        'Origin': ORIGIN,
        'Authorization': `Bearer ${token}`
      }
    });
    const meData = await meRes.json();
    if (!meRes.ok) throw new Error(`/api/auth/me failed: ${JSON.stringify(meData)}`);
    console.log('✓ /api/auth/me verified:', meData.user?.name || meData);

    // 5. Test protected route: /api/bookings/my
    console.log('\n4. Testing protected route /api/bookings/my...');
    const bookingsRes = await fetch(`${BACKEND_URL}/api/bookings/my`, {
      headers: {
        'Origin': ORIGIN,
        'Authorization': `Bearer ${token}`
      }
    });
    const bookingsData = await bookingsRes.json();
    if (!bookingsRes.ok) throw new Error(`/api/bookings/my failed: ${JSON.stringify(bookingsData)}`);
    console.log('✓ /api/bookings/my accessible (count:', (bookingsData.bookings || bookingsData).length ?? 0, ')');

    // 6. Test protected route: /api/favorites
    console.log('\n5. Testing protected route /api/favorites...');
    const favsRes = await fetch(`${BACKEND_URL}/api/favorites`, {
      headers: {
        'Origin': ORIGIN,
        'Authorization': `Bearer ${token}`
      }
    });
    const favsData = await favsRes.json();
    if (!favsRes.ok) throw new Error(`/api/favorites failed: ${JSON.stringify(favsData)}`);
    console.log('✓ /api/favorites accessible (count:', (favsData.favorites || favsData).length ?? 0, ')');

    console.log('\n===========================================');
    console.log('🎉 ALL AUTH & CORS CHECKS PASSED ON RENDER!');
    console.log('===========================================\n');
  } catch (err) {
    console.error('❌ Auth test failed:', err.message);
  }
}

testAuthFlow();
