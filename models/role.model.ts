import { Schema, model, Document } from 'mongoose'

export interface IRole extends Document {
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