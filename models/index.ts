import mongoose, { Model, Mongoose } from "mongoose";
import User, { IUser } from './user.model'
import Role, { IRole } from './role.model'

mongoose.Promise = global.Promise

type IDatabase = {
  mongoose: Mongoose
  User: Model<IUser>,
  Role: Model<IRole>,
  ROLES: string[]
}

const database: IDatabase = {
  mongoose,
  User,
  Role,
  ROLES: ['user', 'admin', 'moderator'],
}

export default database;
