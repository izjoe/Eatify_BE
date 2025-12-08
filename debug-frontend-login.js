// Debug frontend login issue
// This simulates what frontend should send

const API_URL = 'https://eatify-be.onrender.com';

async function testLoginLikeFrontend() {
  console.log('🔍 DEBUGGING FRONTEND LOGIN ISSUE');
  console.log('='.repeat(60));
  console.log('API:', API_URL);
  console.log('');
  
  // Test cases for different scenarios
  const testCases = [
    {
      name: 'Correct credentials',
      email: 'hello@gmail.com',
      password: 'Password123'
    },
    {
      name: 'Wrong password',
      email: 'hello@gmail.com',
      password: 'WrongPassword123'
    },
    {
      name: 'Non-existent user',
      email: 'nonexistent@gmail.com',
      password: 'Password123'
    },
    {
      name: 'Empty password',
      email: 'hello@gmail.com',
      password: ''
    },
    {
      name: 'Empty email',
      email: '',
      password: 'Password123'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log('Email:', testCase.email);
    console.log('Password:', testCase.password ? '***' : '(empty)');
    console.log('-'.repeat(60));
    
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testCase.email,
          password: testCase.password
        })
      });
      
      const data = await response.json();
      
      console.log('Status:', response.status);
      
      if (response.status === 200) {
        console.log('✅ SUCCESS');
        console.log('Token:', data.token?.substring(0, 30) + '...');
      } else if (response.status === 401) {
        console.log('❌ 401 UNAUTHORIZED');
        console.log('Message:', data.message || data.msg);
      } else if (response.status === 400) {
        console.log('❌ 400 BAD REQUEST');
        console.log('Message:', data.message || data.msg);
      } else {
        console.log('❌ OTHER ERROR');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 SUMMARY:');
  console.log('');
  console.log('✅ Working credentials:');
  console.log('   Email: hello@gmail.com');
  console.log('   Password: Password123');
  console.log('');
  console.log('💡 If frontend gets 401:');
  console.log('   1. Check email is exactly: hello@gmail.com');
  console.log('   2. Check password is exactly: Password123 (case-sensitive)');
  console.log('   3. Make sure no extra spaces in email/password');
  console.log('   4. Check request body format: {email: "...", password: "..."}');
  console.log('');
  console.log('🔧 Debug frontend code:');
  console.log('   console.log("Email:", email);');
  console.log('   console.log("Password:", password);');
  console.log('   console.log("Request body:", JSON.stringify({email, password}));');
  console.log('');
}

// Import fetch for Node.js
import fetch from 'node-fetch';

testLoginLikeFrontend().catch(console.error);
