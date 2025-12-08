// Quick register script - Paste your email here
import fetch from 'node-fetch';

// 🔧 THAY ĐỔI EMAIL VÀ PASSWORD CỦA ANH Ở ĐÂY:
const MY_EMAIL = 'user@eatify.com';         // Email test
const MY_PASSWORD = 'Password123';          // Password test
const MY_NAME = 'Eatify User';              // Tên test

// ============================================================

const API_URL = 'https://eatify-be.onrender.com';

async function quickRegister() {
  console.log('🚀 Đang register user trên production...\n');
  console.log('Email:', MY_EMAIL);
  console.log('Password:', MY_PASSWORD);
  console.log('Name:', MY_NAME);
  console.log('='.repeat(60));
  
  // Register
  console.log('\n📝 Registering...');
  const registerRes = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: MY_NAME,
      email: MY_EMAIL,
      password: MY_PASSWORD,
      role: 'buyer'
    })
  });
  
  const registerData = await registerRes.json();
  console.log('Status:', registerRes.status);
  console.log('Response:', JSON.stringify(registerData, null, 2));
  
  if (registerRes.status === 400 && registerData.msg === 'Email already exists') {
    console.log('\n✅ User đã tồn tại! Có thể login luôn.');
  } else if (!registerRes.ok) {
    console.log('\n❌ Registration failed!');
    return;
  } else {
    console.log('\n✅ Registration successful!');
  }
  
  // Test login
  console.log('\n🔐 Testing login...');
  const loginRes = await fetch(`${API_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: MY_EMAIL,
      password: MY_PASSWORD
    })
  });
  
  const loginData = await loginRes.json();
  console.log('Status:', loginRes.status);
  
  if (loginRes.ok) {
    console.log('✅ LOGIN SUCCESS!');
    console.log('Token:', loginData.token.substring(0, 50) + '...');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 HOÀN THÀNH! Thông tin đăng nhập:');
    console.log('Email:', MY_EMAIL);
    console.log('Password:', MY_PASSWORD);
    console.log('='.repeat(60));
  } else {
    console.log('❌ LOGIN FAILED!');
    console.log('Error:', loginData.message || loginData.msg);
  }
}

quickRegister().catch(console.error);
