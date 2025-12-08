// Test script for LOCAL server
// Run: node debug-login-local.js

import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testAPI() {
  console.log('🔍 DEBUGGING LOGIN ISSUE (LOCAL)\n');
  console.log('Local API:', API_URL);
  console.log('=' .repeat(60));
  
  // Test 1: Check if API is responding
  console.log('\n📡 Test 1: Checking API status...');
  try {
    const response = await fetch(API_URL);
    console.log('✅ API is responding:', response.status);
  } catch (error) {
    console.log('❌ API not responding:', error.message);
    console.log('Make sure to run: npm start');
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
  
  // Wait a bit for database to save
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('Token received:', loginData.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ LOGIN FAILED!');
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
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('Token received:', loginData.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ LOGIN FAILED!');
      console.log('Error message:', loginData.message || loginData.msg);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 SUMMARY:');
  console.log('Test email:', testEmail);
  console.log('Test password:', testPassword);
  console.log('\nIf both logins succeed, the fix works!');
  console.log('Now deploy to production: git push origin fix-auth-api');
}

testAPI().catch(console.error);
