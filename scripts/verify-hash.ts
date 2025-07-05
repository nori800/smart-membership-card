import bcrypt from 'bcryptjs'

async function run() {
  const password = 'test1234!'
  const hash = await bcrypt.hash(password, 10)

  console.log('生成されたハッシュ:', hash)

  const match = await bcrypt.compare(password, hash)
  console.log('一致する？:', match)
}

run()