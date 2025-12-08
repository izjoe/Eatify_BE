// Check if latest code is deployed
import fetch from 'node-fetch';

const API_URL = 'https://eatify-be.onrender.com';

async function checkDeployment() {
  console.log('🔍 Checking deployment status...\n');
  
  // Test 1: Check CORS with Origin header
  console.log('1️⃣  Testing CORS with Render origin...');
  try {
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://eatify-be.onrender.com'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test'
      })
    });
    
    const data = await response.json();
    
    if (data.message === 'Not allowed by CORS') {
      console.log('❌ CORS still blocked - Deploy not complete yet');
      console.log('⏳ Wait 2-3 more minutes...\n');
      return false;
    } else {
      console.log('✅ CORS is working!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 2: Normal login test
  console.log('\n2️⃣  Testing actual login...');
  try {
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hello@gmail.com',
        password: 'Password123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login works!');
      console.log('Token:', data.token.substring(0, 30) + '...');
      console.log('\n🎉 DEPLOYMENT COMPLETE! Everything is working!');
      return true;
    } else {
      console.log('❌ Login failed:', data.message || data.msg);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

console.log('📍 API:', API_URL);
console.log('⏰ Time:', new Date().toLocaleString());
console.log('='.repeat(60));

checkDeployment().then(ready => {
  if (ready) {
    console.log('\n✅ You can now use the frontend!');
    console.log('   Email: hello@gmail.com');
    console.log('   Password: Password123');
  } else {
    console.log('\n⏳ Deployment in progress. Try again in 2 minutes.');
    console.log('   Run: node check-deploy.js');
  }
});
