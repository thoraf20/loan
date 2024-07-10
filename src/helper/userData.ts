import { UserType } from "../models/User"

export const hidePassword = (user) => {
  user.password = ''
  return user
}