// ============================================================
// EATIFY AUTHENTICATION TEST SUITE
// Complete testing script for authentication endpoints
// ============================================================

import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PRODUCTION_API = 'https://eatify-be.onrender.com';
const LOCAL_API = 'http://localhost:4000';

// ============================================================
// TEST 1: Hash Password Testing
// ============================================================
async function testPasswordHashing() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 TEST 1: PASSWORD HASHING');
  console.log('='.repeat(60));
  
  const password = 'TestPass123';
  console.log('Password:', password);
  console.log('SALT env:', process.env.SALT);
  
  // Method 1: With genSalt
  const salt1 = await bcrypt.genSalt(Number(process.env.SALT) || 10);
  const hash1 = await bcrypt.hash(password, salt1);
  console.log('\n✅ Method 1 (genSalt):', await bcrypt.compare(password, hash1) ? 'MATCH' : 'NO MATCH');
  
  // Method 2: Direct with rounds
  const hash2 = await bcrypt.hash(password, 10);
  console.log('✅ Method 2 (direct):', await bcrypt.compare(password, hash2) ? 'MATCH' : 'NO MATCH');
}

// ============================================================
// TEST 2: Database Check
// ============================================================
async function testDatabaseCheck() {
  console.log('\n' + '='.repeat(60));
  console.log('💾 TEST 2: DATABASE CHECK');
  console.log('='.repeat(60));
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String
    });
    const User = mongoose.model('users', userSchema);
    
    const user = await User.findOne().sort({ _id: -1 }).limit(1);
    
    if (!user) {
      console.log('❌ No users found in database');
      await mongoose.disconnect();
      return;
    }
    
    console.log('\n📋 Last registered user:');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Hash length:', user.password?.length);
    
    await mongoose.disconnect();
    console.log('✅ Database check complete');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

// ============================================================
// TEST 3: API Testing (Production or Local)
// ============================================================
async function testAPI(apiUrl, label) {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 TEST 3: API TESTING - ${label}`);
  console.log('='.repeat(60));
  console.log('API URL:', apiUrl);
  
  // Check API status
  console.log('\n📡 Checking API status...');
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      console.log('✅ API is responding');
    } else {
      console.log('❌ API not responding properly:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ API not available:', error.message);
    return;
  }
  
  // Register new test user
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testEmail = `test_${timestamp}_${random}@example.com`;
  const testPassword = 'TestPass123';
  
  console.log('\n👤 Registering new test user...');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  
  try {
    const registerRes = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: testPassword
      })
    });
    
    const registerData = await registerRes.json();
    
    if (!registerRes.ok) {
      console.log('❌ Registration failed:', registerData.msg || registerData.message);
      return;
    }
    
    console.log('✅ Registration successful');
    console.log('UserID:', registerData.userID);
    
  } catch (error) {
    console.log('❌ Register error:', error.message);
    return;
  }
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Test login with /api/user/login
  console.log('\n🔐 Testing login with /api/user/login...');
  try {
    const loginRes1 = await fetch(`${apiUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginData1 = await loginRes1.json();
    
    if (loginRes1.ok) {
      console.log('✅ LOGIN SUCCESS with /api/user/login');
      console.log('Token:', loginData1.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ LOGIN FAILED with /api/user/login');
      console.log('Error:', loginData1.message || loginData1.msg);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test login with /api/auth/login
  console.log('\n🔐 Testing login with /api/auth/login...');
  try {
    const loginRes2 = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginData2 = await loginRes2.json();
    
    if (loginRes2.ok) {
      console.log('✅ LOGIN SUCCESS with /api/auth/login');
      console.log('Token:', loginData2.token?.substring(0, 50) + '...');
    } else {
      console.log('❌ LOGIN FAILED with /api/auth/login');
      console.log('Error:', loginData2.message || loginData2.msg);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
}

// ============================================================
// TEST 4: Register Custom User
// ============================================================
async function registerCustomUser(email, password, name = 'Custom User') {
  console.log('\n' + '='.repeat(60));
  console.log('👤 TEST 4: REGISTER CUSTOM USER');
  console.log('='.repeat(60));
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Name:', name);
  
  try {
    const registerRes = await fetch(`${PRODUCTION_API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: 'buyer'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('\nStatus:', registerRes.status);
    console.log('Response:', JSON.stringify(registerData, null, 2));
    
    if (!registerRes.ok) {
      if (registerData.msg === 'Email already exists') {
        console.log('\n✅ User already exists! You can login directly.');
      } else {
        console.log('\n❌ Registration failed!');
      }
      return false;
    }
    
    console.log('\n✅ Registration successful!');
    
    // Test login
    console.log('\n🔐 Testing login...');
    const loginRes = await fetch(`${PRODUCTION_API}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const loginData = await loginRes.json();
    
    if (loginRes.ok) {
      console.log('✅ LOGIN SUCCESS!');
      console.log('Token:', loginData.token.substring(0, 50) + '...');
      return true;
    } else {
      console.log('❌ LOGIN FAILED!');
      console.log('Error:', loginData.message || loginData.msg);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// ============================================================
// MAIN TEST RUNNER
// ============================================================
async function runAllTests() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('  🧪 EATIFY AUTHENTICATION TEST SUITE');
  console.log('═'.repeat(60));
  
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  try {
    if (testType === 'hash' || testType === 'all') {
      await testPasswordHashing();
    }
    
    if (testType === 'db' || testType === 'all') {
      await testDatabaseCheck();
    }
    
    if (testType === 'production' || testType === 'all') {
      await testAPI(PRODUCTION_API, 'PRODUCTION');
    }
    
    if (testType === 'local') {
      await testAPI(LOCAL_API, 'LOCAL');
    }
    
    if (testType === 'register') {
      const email = args[1] || 'test@example.com';
      const password = args[2] || 'TestPass123';
      const name = args[3] || 'Test User';
      await registerCustomUser(email, password, name);
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('  ✅ ALL TESTS COMPLETED');
    console.log('═'.repeat(60));
    console.log('\nUsage:');
    console.log('  node auth-test.js                    # Run all tests');
    console.log('  node auth-test.js production         # Test production only');
    console.log('  node auth-test.js local              # Test local only');
    console.log('  node auth-test.js hash               # Test password hashing');
    console.log('  node auth-test.js db                 # Test database');
    console.log('  node auth-test.js register <email> <password> <name>');
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error);
  }
}

// Run tests
runAllTests().catch(console.error);
