// Test with FRESH user - no previous data
import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function test() {
  // Use completely unique email
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testEmail = `fresh_${timestamp}_${random}@test.com`;
  const testPassword = 'FreshPass123';
  
  console.log('🔍 Testing with FRESH user (no previous data)');
  console.log('='.repeat(60));
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('='.repeat(60));
  
  // Register
  console.log('\n1️⃣  Registering...');
  const registerRes = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Fresh User',
      email: testEmail,
      password: testPassword
    })
  });
  
  const registerData = await registerRes.json();
  console.log('Status:', registerRes.status);
  console.log('Response:', JSON.stringify(registerData, null, 2));
  
  if (!registerRes.ok) {
    console.log('❌ Registration failed!');
    return;
  }
  
  console.log('✅ Registration successful!');
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Login with /api/user/login
  console.log('\n2️⃣  Login with /api/user/login...');
  const loginRes1 = await fetch(`${API_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  
  const loginData1 = await loginRes1.json();
  console.log('Status:', loginRes1.status);
  console.log('Response:', JSON.stringify(loginData1, null, 2));
  
  if (loginRes1.ok) {
    console.log('✅ LOGIN SUCCESS with /api/user/login!');
  } else {
    console.log('❌ LOGIN FAILED with /api/user/login!');
  }
  
  // Login with /api/auth/login
  console.log('\n3️⃣  Login with /api/auth/login...');
  const loginRes2 = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  
  const loginData2 = await loginRes2.json();
  console.log('Status:', loginRes2.status);
  console.log('Response:', JSON.stringify(loginData2, null, 2));
  
  if (loginRes2.ok) {
    console.log('✅ LOGIN SUCCESS with /api/auth/login!');
  } else {
    console.log('❌ LOGIN FAILED with /api/auth/login!');
  }
  
  console.log('\n' + '='.repeat(60));
  if (loginRes1.ok && loginRes2.ok) {
    console.log('🎉 SUCCESS! Both endpoints work!');
    console.log('The fix is working. Deploy to production now:');
    console.log('git add -A');
    console.log('git commit -m "fix: sync password hashing across all controllers"');
    console.log('git push origin fix-auth-api');
  } else {
    console.log('❌ Still failing. Need more investigation.');
  }
}

test().catch(console.error);
