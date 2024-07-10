import UserModel from '../models/User'

export default class UserService {
  static findByEmail(email: string) {
    return UserModel.findOne({ email }).exec()
  }

  static findById(id: string) {
    return UserModel.findOne({ _id: id }).exec()
  }
}
