import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function bcryptHash(password: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds)
}

function bcryptCompare(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function genAccessToken<T extends string | object | Buffer>(
  payload: T,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions
): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options || {}, (err, token) => {
      if (err || !token) {
        reject(err)
        return
      }
      resolve(token)
    })
  })
}


export { bcryptHash, bcryptCompare, genAccessToken }