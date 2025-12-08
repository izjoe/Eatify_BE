// Test if the hash in database is valid
import bcrypt from 'bcrypt';

const storedHash = '$2b$10$8Yf2keA5e0R9bOLnsMHZEuMrZwcUlPUdB3HTvEM3qdLs8Aafx1eO6';
const passwords = [
  'FreshPass123',
  'TestPass123',
  'Fresh User', // Maybe hashed the name?
  'fresh_1765233634891_w8zsun@test.com', // Email?
  '', // Empty?
];

console.log('🔍 Testing stored hash against various passwords\n');
console.log('Stored hash:', storedHash);
console.log('='.repeat(60));

for (const pwd of passwords) {
  const match = await bcrypt.compare(pwd, storedHash);
  console.log(`"${pwd}": ${match ? '✅ MATCH!' : '❌ no match'}`);
}

console.log('\n' + '='.repeat(60));
console.log('If none match, the password was transformed before hashing.');
