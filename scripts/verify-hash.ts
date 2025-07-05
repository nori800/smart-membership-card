//import bcrypt from 'bcryptjs'

//async function run() {
//  const password = 'test1234!'
//  const hash = await bcrypt.hash(password, 10)

//  console.log('生成されたハッシュ:', hash)

//  const match = await bcrypt.compare(password, hash)
//  console.log('一致する？:', match)
//}

//run()

// verify-hash.ts
import bcrypt from 'bcryptjs';

const plainPassword = 'password'; // ← 試したいパスワード
const storedHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

async function run() {
  const match = await bcrypt.compare(plainPassword, storedHash);
  console.log('パスワード一致する？:', match);
}

run();