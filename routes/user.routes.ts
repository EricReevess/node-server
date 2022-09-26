import { Express } from 'express'
import { verifyToken, isAdmin, setResponseHeader } from '../middleware'
import { adminBoard, allAccess, moderatorBoard, userBoar } from '../controllers/user.controller'

export default function user(app: Express): void {
  app.use(setResponseHeader)
  app.get('/api/test/all', allAccess)
  app.get('/api/test/user', [verifyToken], userBoar)
  app.get('/api/test/mod', [verifyToken], moderatorBoard)
  app.get('/api/test/admin', [verifyToken, isAdmin], adminBoard)
}