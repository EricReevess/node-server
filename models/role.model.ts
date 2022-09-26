import mongoose, { Schema, model } from 'mongoose'

export interface IRole {
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
  }
})

const Role = model<IRole>('role', RoleSchema)

export default Role