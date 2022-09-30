import gravatar from 'gravatar'
import database from "../models";
import { bcryptCompare, bcryptHash, genAccessToken } from '../utils';
import { JWT_EXPIRES_IN, PRIVATE_KEY } from "../config/auth.config";

import type { IUserRequest, CustomResponse, UserTokenPayload, IRefreshTokenRequest } from '../types';
import type { IRole } from '../models/role.model';
import RefreshToken from '../models/refresh-token.model';

const { User, Role } = database

interface PopulatedParent {
  roles: IRole[];
}

export function signUp(
  req: IUserRequest,
  res: CustomResponse,
): void {
  const { username, email, password, roles } = req.body

  const avatar = gravatar.url(email, { s: '200', r: 'bg', d: 'mm' })


  bcryptHash(password.toString(), 8).then((hash) => {
    const user = new User({
      username,
      email,
      password: hash,
      avatar,
    })

    if (!roles.length) {
      return Role.findOne({ name: 'user' }).then((role) => {
        if (!role) {
          throw new Error('没有找到基础角色 User')
        }
        user.roles = [role._id]

        return user.save()
      })
    }

    return Role.find({
      name: { '$in': roles }
    }).then((roles) => {
      if (!roles) {
        throw Error('没有找到有效角色')
      }
      if (roles) {
        user.roles = roles.map(role => (role._id))
      }
      console.log('user role was saved');
      return user.save()
    })

  }).then(() => {
    res.json({ code: 0, msg: '注册成功' })
  }).catch((err) => {
    res.status(500).json({ code: -1, msg: err })
  })
}

export function signIn(
  req: IUserRequest,
  res: CustomResponse,
): void {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ code: -1, msg: '无效的参数' })
    return
  }

  User.findOne({
    email,
  }).populate<Pick<PopulatedParent, 'roles'>>('roles', '-_id -__v') // the '-' prefix means remove field in result
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ code: -1, msg: err })
        return
      }

      if (!user || !password) {
        res.status(401).json({ code: -1, msg: '用户名或密码错误' })
        return
      }

      bcryptCompare(password.toString(), user.password)
        .then((isMatch) => {
          if (!isMatch) {
            res.status(401).json({ code: -1, msg: '用户名或密码错误' })
            return
          }

          return genAccessToken<UserTokenPayload>(
            { id: user.id },
            PRIVATE_KEY,
            { expiresIn: JWT_EXPIRES_IN }
          )
        }).then((token) => {

          const refreshToken = RefreshToken.createToken(user.id)

          const authorities = user.roles.map((role) => 'ROLE_' + role.name.toUpperCase())

          res.status(200).json({
            code: 0, data: {
              id: user.id,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
              refreshToken,
            }
          })
        })

    })

}

export function refreshToken(
  req: IRefreshTokenRequest,
  res: CustomResponse,
): void {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(403).json({ code: -1, msg: "Refresh Token is required!" });
    return
  }

  RefreshToken.findOne({ token: refreshToken }).then(async (refreshTokenDoc) => {
    if (!refreshTokenDoc) {
      res.status(403).json({ code: -1, msg: "Refresh Token is invalid!" });
      return
    }

    if (RefreshToken.isTokenExpired(refreshTokenDoc)) {

      res.status(403).json({ code: -1, msg: 'Refresh Token 已经过期了' })

      return RefreshToken.findOneAndRemove(refreshTokenDoc._id, { useFindAndModify: false })
        .exec()
    }

    const newAccessToken = await genAccessToken<UserTokenPayload>(
      { id: refreshTokenDoc.user._id.toString() },
      PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    )

    return res.status(200).json({
      code: 0,
      data: {
        accessToken: newAccessToken,
        refreshToken: refreshTokenDoc.token
      }
    })
  }).catch((err => {
    if (err) {
      res.status(500).json({ code: -1, msg: err });
      return
    }
  }))

}
