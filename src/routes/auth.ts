import { RequestHandler } from 'express'
import httpStatus from 'http-status-codes'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import { validateAndCheckPermission, hidePassword } from '../helper/index'
import UserModel from '../models/User'
import { passwordPattern } from '../utils'

export const registerHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = {
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(passwordPattern)
      .min(8)
      .required()
      .error(
        new Error(
          'Please match your password to the rules above for your enhanced security'
        )
      ),
  }

  const value = await validateAndCheckPermission(req, next, requestSchema, 'body')

  const existingUser = await UserModel.findOne({
    email: value.email,
  })

  if (existingUser){
    return res.status(httpStatus.CONFLICT).json({ msg: "email already exist" })
  }

  const passwordHash = await bcrypt.hash(value.password, 10)

  const createdUser = await UserModel.create({
    email: value.email,
    password: passwordHash,
  })

  // TODO: send verification message to user

  return res.status(httpStatus.CREATED).json({
    msg: `Account created. Verify your email with code: ${1234}`,
    data: hidePassword(createdUser),
  })
}

export const verifyEmail: RequestHandler = async(req, res, next) => {
  const requestSchema = {
    email: Joi.string().email().required(),
    code: Joi.string().required()
  }

  const value = await validateAndCheckPermission(req, next, requestSchema, 'body')

  const existingUser = await UserModel.findOne({
    email: value.email,
  })

  if (!existingUser) {
    return res.status(httpStatus.NOT_FOUND).json({ msg: "user account does not exist"})
  }

  if (existingUser.isEmailVerified === true) {
    return res.status(httpStatus.CONFLICT).json({ msg: "user account already verify"})
  }

  if (value.code !== "1234") {
    return res.status(httpStatus.FORBIDDEN).json({ msg: "invalid verification code" })
  }
    
  await UserModel.updateOne({ _id: existingUser._id, isEmailVerified: true })

  return res
    .status(httpStatus.OK)
    .json({ msg: 'verification successful' })
}

// export const loginHandler: RequestHandler = async (req, res, next) => {
//   const requestSchema = {

//   }
// }