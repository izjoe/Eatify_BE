// Test script to debug login issue
// Run: node debug-login.js

import fetch from 'node-fetch';

const API_URL = 'https://eatify-be.onrender.com';

async function testAPI() {
  console.log('🔍 DEBUGGING LOGIN ISSUE\n');
  console.log('Production API:', API_URL);
  console.log('=' .repeat(60));
  
  // Test 1: Check if API is responding
  console.log('\n📡 Test 1: Checking API status...');
  try {
    const response = await fetch(API_URL);
    console.log('✅ API is responding:', response.status);
  } catch (error) {
    console.log('❌ API not responding:', error.message);
    return;
  }
  
  // Test 2: Register a new test user
  console.log('\n👤 Test 2: Registering new test user...');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPass123';
  
  try {
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: testPassword
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Status:', registerResponse.status);
    console.log('Register Response:', JSON.stringify(registerData, null, 2));
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed');
      return;
    }
    
    console.log('✅ User registered successfully');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
  } catch (error) {
    console.log('❌ Register error:', error.message);
    return;
  }
  
  // Test 3: Try to login with the new user
  console.log('\n🔐 Test 3: Testing login with /api/user/login...');
  try {
    const loginResponse = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Token received:', loginData.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ Login failed!');
      console.log('Error message:', loginData.message || loginData.msg);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test 4: Try alternative login endpoint
  console.log('\n🔐 Test 4: Testing login with /api/auth/login...');
  try {
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Token received:', loginData.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ Login failed!');
      console.log('Error message:', loginData.message || loginData.msg);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 SUMMARY:');
  console.log('Test email:', testEmail);
  console.log('Test password:', testPassword);
  console.log('\nTry logging in with these credentials in your frontend app.');
  console.log('If it still fails, check Render logs for detailed error messages.');
}

testAPI().catch(console.error);
