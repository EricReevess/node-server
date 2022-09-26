import { NextFunction } from "express";
import database from "../models";
import { IUserRequest, CustomResponse } from "../types";

const { ROLES, User } = database

export function checkSignUpParams(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  const { username, email, password, roles } = req.body

  if (!username || !email || !password! || !roles) {
    res.status(400).json({ code: -1, msg: '无效的参数' })
    return
  }
  next()
}

export function checkDuplicateUsername(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  const { username } = req.body

  User.findOne({ username })
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ code: -1, msg: err })
        return
      }

      if (user) {
        res.status(400).json({ code: -1, msg: '该用户名已经被使用' })
        return;
      }

      next();
    })

}

export function checkDuplicateEmail(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  const { email } = req.body
  User.findOne({ email })
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ code: -1, msg: err })
        return
      }

      if (user) {
        res.status(400).json({ code: -1, msg: '该邮箱已经被使用' })
        return;
      }
      next();
    })
}


export function checkRolesExisted(
  req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  const { roles } = req.body
  if (!roles) {
    res.status(400).json({ code: -1, msg: '没有提供角色信息' })
    return
  }

  const isAvailableRole = roles.every((role) => ROLES.includes(role))

  if (!isAvailableRole) {
    res.status(400).json({ code: -1, msg: '角色信息错误' })
    return;
  }
  next();
}

export function setResponseHeader(
  _req: IUserRequest,
  res: CustomResponse,
  next: NextFunction,
): void {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept')
  next();
}

