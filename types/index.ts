import { Request, Response } from "express";
import { IncomingHttpHeaders } from "http2";

export interface UserHeader {
  'x-access-token'?: string;
}

export interface IRequest<B, H> extends Request {
  body: B,
  headers: IncomingHttpHeaders & H,
  userID?: string,
  [x: string]: any
}

export interface UserTokenPayload {
  id: string;
}

export interface JwtExpPayload {
  expiresIn: string;
  exp: number;
}

export type CustomResponse = Response<ResponseBody>

export type IUserRequest = IRequest<RequestBody, UserHeader>

export type RequestBody = {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export type ResponseBody = {
  code: -1 | 0,
  msg?: string | Error;
  data?: any;
}

