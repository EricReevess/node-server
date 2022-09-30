import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { NextFunction } from "express";
import { PRIVATE_KEY } from '../config/auth.config'
import database from '../models'
import { IUserRequest, CustomResponse, UserTokenPayload } from '../types';

const { User, Role } = database

export function catchTokenExpError(err: jwt.VerifyErrors, res: CustomResponse): void {
  if (err instanceof TokenExpiredError) {
    res.status(401).json({ code: -1, msg: 'Token 已经过期' })
    return
  }
  res.status(401).json({ code: -1, msg: '未经授权的访问' })

}

export function verifyToken(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(403).json({ code: -1, msg: '没有提供 token' })
    return;
  }

  jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return catchTokenExpError(err, res)
    }

    req.userID = (decoded as UserTokenPayload).id

    next()
  })
}

export function isAdmin(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  if (!req.userID) {
    res.status(500).json({ code: -1, msg: '没有找到Token' })
    return
  }
  User.findById(req.userID)
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ code: -1, msg: err })
        return;
      }

      Role.find({ _id: { '$in': user?.roles } })
        .exec((err, roles) => {
          if (err) {
            res.status(500).json({ code: -1, msg: err })
            return;
          }

          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }

          res.status(403).send({ code: -1, msg: '你没有管理员权限' });
        })
    })
}
