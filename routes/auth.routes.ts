import {
  checkDuplicateEmail,
  checkDuplicateUsername,
  checkRolesExisted,
  setResponseHeader
} from '../middleware'
import { Express } from 'express'
import { signIn, signUp, refreshToken } from '../controllers/auth.controller'
import { checkSignUpParams } from '../middleware/verify-signup'

export default function auth(app: Express) {
  app.use(setResponseHeader)
  app.post('/api/auth/signup', [
    checkSignUpParams,
    checkDuplicateUsername,
    checkDuplicateEmail,
    checkRolesExisted
  ], signUp)
  app.post('/api/auth/signin', signIn)
  app.post('/api/auth/refreshToken', refreshToken)
}