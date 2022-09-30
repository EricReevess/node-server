import mongoose, { Model, Mongoose } from "mongoose";
import User, { IUser } from './user.model'
import Role, { IRole } from './role.model'
import RefreshToken, { IRefreshToken } from './refresh-token.model'

mongoose.Promise = global.Promise

type IDatabase = {
  mongoose: Mongoose
  User: Model<IUser>,
  Role: Model<IRole>,
  RefreshToken: Model<IRefreshToken>
  ROLES: string[]
}

const database: IDatabase = {
  mongoose,
  User,
  Role,
  RefreshToken,
  ROLES: ['user', 'admin', 'moderator'],
}

export default database;
