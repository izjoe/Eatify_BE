// Direct database check
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
});

const User = mongoose.model('users', userSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find the last registered user
    const user = await User.findOne().sort({ _id: -1 }).limit(1);
    
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    
    console.log('\n📋 Last registered user:');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Password hash:', user.password);
    console.log('Hash length:', user.password?.length);
    console.log('Hash starts with:', user.password?.substring(0, 7));
    
    // Test password
    const testPassword = 'FreshPass123';
    console.log('\n🔐 Testing password:', testPassword);
    
    const match = await bcrypt.compare(testPassword, user.password);
    console.log('Result:', match ? '✅ MATCH' : '❌ NO MATCH');
    
    // Try with TestPass123 too
    const match2 = await bcrypt.compare('TestPass123', user.password);
    console.log('Testing "TestPass123":', match2 ? '✅ MATCH' : '❌ NO MATCH');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
