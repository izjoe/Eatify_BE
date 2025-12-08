// Debug password hashing
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const password = 'TestPass123';

async function testHash() {
  console.log('🔍 Testing Password Hashing\n');
  console.log('Password:', password);
  console.log('SALT env:', process.env.SALT);
  console.log('='.repeat(60));
  
  // Method 1: Like authController (FIXED VERSION)
  console.log('\n1️⃣  Method 1: authController (NEW - with genSalt)');
  const salt1 = await bcrypt.genSalt(Number(process.env.SALT) || 10);
  const hash1 = await bcrypt.hash(password, salt1);
  console.log('Salt rounds:', Number(process.env.SALT) || 10);
  console.log('Generated salt:', salt1);
  console.log('Hash:', hash1.substring(0, 60) + '...');
  
  // Test compare
  const match1 = await bcrypt.compare(password, hash1);
  console.log('Compare result:', match1 ? '✅ MATCH' : '❌ NO MATCH');
  
  // Method 2: Like userController
  console.log('\n2️⃣  Method 2: userController (genSalt)');
  const salt2 = await bcrypt.genSalt(Number(process.env.SALT));
  const hash2 = await bcrypt.hash(password, salt2);
  console.log('Salt rounds:', Number(process.env.SALT));
  console.log('Generated salt:', salt2);
  console.log('Hash:', hash2.substring(0, 60) + '...');
  
  const match2 = await bcrypt.compare(password, hash2);
  console.log('Compare result:', match2 ? '✅ MATCH' : '❌ NO MATCH');
  
  // Method 3: Direct hash with number (POSSIBLE BUG)
  console.log('\n3️⃣  Method 3: Direct with rounds number');
  const hash3 = await bcrypt.hash(password, 10);
  console.log('Salt rounds:', 10);
  console.log('Hash:', hash3.substring(0, 60) + '...');
  
  const match3 = await bcrypt.compare(password, hash3);
  console.log('Compare result:', match3 ? '✅ MATCH' : '❌ NO MATCH');
  
  // Cross-compare
  console.log('\n🔄 Cross-comparison:');
  console.log('Password vs hash1:', await bcrypt.compare(password, hash1) ? '✅' : '❌');
  console.log('Password vs hash2:', await bcrypt.compare(password, hash2) ? '✅' : '❌');
  console.log('Password vs hash3:', await bcrypt.compare(password, hash3) ? '✅' : '❌');
  
  console.log('\n' + '='.repeat(60));
  console.log('All methods should work individually.');
  console.log('The issue might be with how production env vars are set.');
}

testHash().catch(console.error);
