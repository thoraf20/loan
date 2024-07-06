import { model, Schema } from 'mongoose'

type USDT = {
  name: string
  token: string
}

type User = {
  _id: string
  email: string
  phoneNumber: string
  bankAccount: { bvn: string; accountNumber: string; bankCode: string }
  wallet: {
    ethAddress: string
    bnbAddress: string
    solAddress: string
    USDT: USDT
  }
  isPhoneNumberVerified: boolean
}

const schema = new Schema<User>(
  {
    _id: { type: String },
    email: { type: String, required: true },
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
      USDT: { name: {type: String }, token: { type: String } },
    },
    isPhoneNumberVerified: { type: Boolean, default: false },
  },
  { collection: 'users', _id: false, timestamps: true }
)

const UserModel = model<User>('Users', schema)

export default UserModel
