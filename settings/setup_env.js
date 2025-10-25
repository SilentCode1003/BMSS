const fs = require('fs')
const readline = require('readline')
const { EncryptString, DecryptString } = require('../repository/helper/cryptography')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer)))

function parseEnv(fileContent) {
  const lines = fileContent.split('\n')
  const env = {}

  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^'|'$/g, '')
      env[key] = val
    }
  }

  return env
}

async function main() {
  console.log('🛠️  Updating .env configuration...\n')

  let existingEnv = {}
  if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf-8')
    existingEnv = parseEnv(content)
  }

  const decryptedDbPassword = existingEnv._PASSWORD ? DecryptString(existingEnv._PASSWORD) : ''
  const decryptedEmailPassword = existingEnv._EMAIL_PASSWORD
    ? DecryptString(existingEnv._EMAIL_PASSWORD)
    : ''
  const decryptedSecretKey = existingEnv._SECRET_KEY ? DecryptString(existingEnv._SECRET_KEY) : ''
  const decryptedSwaggerPassword = existingEnv._SWAGGER_PASS
    ? DecryptString(existingEnv._SWAGGER_PASS)
    : ''

  // Relational DB
  const host =
    (await ask(`DB Host [${existingEnv._HOST || 'localhost'}]: `)) ||
    existingEnv._HOST ||
    'localhost'
  const user =
    (await ask(`DB User [${existingEnv._USER || 'root'}]: `)) || existingEnv._USER || 'root'
  const password = await ask(`DB Password [hidden]: `)
  const database =
    (await ask(`Database Name [${existingEnv._DATABASE || ''}]: `)) || existingEnv._DATABASE

  // Server Port
  const server_port =
    (await ask(`Server Port [${existingEnv._PORT || '3004'}]: `)) || existingEnv._PORT || '3004'

  // MongoDB
  const mongoUri =
    (await ask(`Mongo URI [${existingEnv._MONGO_URI || 'mongodb://localhost:27017/HRMIS'}]: `)) ||
    existingEnv._MONGO_URI ||
    'mongodb://localhost:27017/HRMIS'
  const sessionCollection =
    (await ask(
      `Mongo Session Collection [${existingEnv._SESSION_COLLECTION || 'HRMISSessions'}]: `
    )) ||
    existingEnv._SESSION_COLLECTION ||
    'HRMISSessions'

  // Email
  const emailHost =
    (await ask(`Email Host [${existingEnv._EMAIL_HOST || ''}]: `)) || existingEnv._EMAIL_HOST
  const emailPort =
    (await ask(`Email Port [${existingEnv._EMAIL_PORT || '587'}]: `)) ||
    existingEnv._EMAIL_PORT ||
    '587'
  const emailUser =
    (await ask(`Email User [${existingEnv._EMAIL_USER || ''}]: `)) || existingEnv._EMAIL_USER
  const emailPass = await ask(`Email Password [hidden]: `)
  const emailFrom =
    (await ask(
      `Email From [${existingEnv._EMAIL_FROM || 'Chrnonus <no-reply@5lsolutions.com>'}]: `
    )) || existingEnv._EMAIL_FROM

  // Secret Key & Swagger Auth
  const secretKey = (await ask(`Secret Key [${decryptedSecretKey}]: `)) || decryptedSecretKey
  const swaggerUser =
    (await ask(`Swagger Username [${existingEnv._SWAGGER_USER || 'admin'}]: `)) ||
    existingEnv._SWAGGER_USER ||
    'admin'
  const swaggerPass =
    (await ask(`Swagger Password [${decryptedSwaggerPassword}]: `)) || decryptedSwaggerPassword

  // Encrypt
  const encryptedDbPassword = password ? EncryptString(password) : existingEnv._PASSWORD
  const encryptedEmailPassword = emailPass ? EncryptString(emailPass) : existingEnv._EMAIL_PASSWORD
  const encryptedSwaggerPassword = swaggerPass
    ? EncryptString(swaggerPass)
    : existingEnv._SWAGGER_PASS
  const encryptedSecretKey = secretKey ? EncryptString(secretKey) : existingEnv._SECRET_KEY

  const finalContent = `
_HOST='${host}'
_USER='${user}'
_PASSWORD='${encryptedDbPassword}'
_DATABASE='${database}'

#Server Port
_PORT='${server_port}'

#MonggoDB Connections
_MONGO_URI='${mongoUri}'
_SESSION_COLLECTION='${sessionCollection}'

#Email Configuration
_EMAIL_HOST='${emailHost}'
_EMAIL_PORT='${emailPort}'
_EMAIL_USER='${emailUser}'
_EMAIL_FROM='${emailFrom}'
_EMAIL_PASSWORD='${encryptedEmailPassword}'

#Secret Key
_SECRET_KEY='${encryptedSecretKey}'

#Swagger Auth
_SWAGGER_USER='${swaggerUser}'
_SWAGGER_PASS='${encryptedSwaggerPassword}'
`.trim()

  fs.writeFileSync('.env', finalContent, 'utf-8')
  console.log('\n✅ .env file updated successfully!')
  rl.close()
}

main()
