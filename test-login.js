// Continuous login test - Test hello@gmail.com repeatedly
import fetch from 'node-fetch';

const API_URL = 'https://eatify-be.onrender.com';
const TEST_EMAIL = 'hello@gmail.com';
const TEST_PASSWORD = 'Password123';

async function testLogin() {
  console.log('🔐 Testing login...');
  console.log('Email:', TEST_EMAIL);
  console.log('Password:', TEST_PASSWORD);
  console.log('='.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('✅ LOGIN SUCCESS!');
      console.log('Token:', data.token.substring(0, 50) + '...');
      console.log('Role:', data.role);
      console.log('UserID:', data.userID);
      console.log('\n🎉 Credentials work! You can use them in frontend now.');
      return true;
    } else {
      console.log('❌ LOGIN FAILED!');
      console.log('Error:', data.message || data.msg);
      return false;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Run test
console.log('\n📍 Testing production API:', API_URL);
console.log('Date:', new Date().toLocaleString());
console.log('');

testLogin().then(success => {
  process.exit(success ? 0 : 1);
});
