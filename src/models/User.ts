import { model, Schema } from 'mongoose'

type USDT = {
  name: string
  token: string
}

export type UserType = {
  email: string
  password: string
  phoneNumber: string
  bankAccount: { bvn: string; accountNumber: string; bankCode: string }
  wallet: {
    ethAddress: string
    bnbAddress: string
    solAddress: string
    USDT: USDT
  }
  isEmailVerified: boolean
}

const schema = new Schema<UserType>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    bankAccount: {
      bvn: { type: String },
      accountNumber: { type: String },
      bankCode: { type: String },
    },
    wallet: {
      ethAddress: { type: String },
      bnbAddress: { type: String },
      solAddress: { type: String },
      USDT: { name: { type: String }, token: { type: String } },
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { collection: 'users', timestamps: true }
)

const UserModel = model<UserType>('Users', schema)

export default UserModel
