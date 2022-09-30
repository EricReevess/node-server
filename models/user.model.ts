import  { Schema, model, Types, Document } from 'mongoose'


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Types.ObjectId[];
  createTime: Date;
  modifyTime: Date;
  avatar?: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'role'
  }],
  createTime: {
    type: Date,
    default: Date.now()
  },
  modifyTime: {
    type: Date,
  },
  avatar: {
    type: String,
  },
})
// 'user' and 'users' all mapping mongodb collection name 'users'
const User = model<IUser>('user', UserSchema)

export default User 