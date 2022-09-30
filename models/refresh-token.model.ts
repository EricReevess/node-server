import { Schema, model, Types, Document, Model } from 'mongoose'
import { v4 as uuidV4 } from 'uuid'
import { JWT_REFRESH_EXP } from '../config/auth.config';

export interface IRefreshToken extends Document {
  token: string;
  user: Types.ObjectId,
  expiryDate: Date
}

// 静态方法 接口 类型声明
export interface IRefreshTokenModel extends Model<IRefreshToken> {
  createToken: (userID: Schema.Types.ObjectId) => string;
  isTokenExpired: (token: IRefreshToken) => boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expiryDate: {
    type: Date,
    required: true,
  }
})

// 增加静态方法，创建refreshToken后 返回token内容
RefreshTokenSchema.static('createToken',
  function (userID: Schema.Types.ObjectId) {
    const expiredAt = new Date()

    // 生成过期时间
    expiredAt.setSeconds(
      expiredAt.getSeconds() + JWT_REFRESH_EXP
    )

    const token = uuidV4()

    const doc = new RefreshToken({
      token,
      user: userID,
      expiryDate: expiredAt.getTime()
    })

    doc.save()

    return doc.token
  }
)

RefreshTokenSchema.static('isTokenExpired',
  function (token: IRefreshToken) {
    return token.expiryDate.getTime() < new Date().getTime()
  }
)

const RefreshToken = model<IRefreshToken, IRefreshTokenModel>('refreshToken', RefreshTokenSchema)

export default RefreshToken