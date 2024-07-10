import { RequestHandler } from 'express'
import httpStatus from 'http-status-codes'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateAndCheckPermission, hidePassword } from '../helper/index'
import UserModel from '../models/User'
import { passwordPattern } from '../utils'
import UserService from '../service/user'

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

  const existingUser = await UserService.findByEmail(value.email)

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

  const existingUser = await UserService.findByEmail(value.email)

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

export const loginHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = {
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }

  const value = await validateAndCheckPermission(req, next, requestSchema, 'body')
  
  const existingUser = await UserService.findByEmail(value.email)

  if (!existingUser) {
    return res.status(httpStatus.NOT_FOUND).json({ msg: "user account does not exist"})
  }

  const isPasswordMatch = await bcrypt.compare(value.password, existingUser.password)

  if (!isPasswordMatch){
    return res.status(httpStatus.BAD_REQUEST).json({ msg: "invalid email and password combination" })
  }

  const token = jwt.sign(
    { userId: existingUser._id, email: existingUser.email },
    `${process.env.JWT_SECRET}`,
    { expiresIn: process.env.JWT_SECRET_EXPRIRESIN }
  )

  return res.status(httpStatus.OK).json({ msg: "login successful", data: hidePassword(existingUser), token })
}

export const sendCode: RequestHandler = async(req, res, next) => {
  const requestSchema = {
    email: Joi.string().email().required()
  }

  const value = await validateAndCheckPermission(req, next, requestSchema, 'body')
  
  const existingUser = await UserService.findByEmail(value.email)

  if (!existingUser) {
    return res.status(httpStatus.NOT_FOUND).json({ msg: "user account does not exist"})
  }

  if (existingUser.isEmailVerified === false) {
    return res.status(httpStatus.FORBIDDEN).json({ msg: "user account has not been verified"})
  }

  return res.status(httpStatus.OK).json({ msg: "Use 1234 as your code"})
}

export const resetPassword: RequestHandler = async( req, res, next) => {
  const requestSchema = {
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    newPassword: Joi.string()
     .regex(passwordPattern)
     .min(8)
     .required()
     .error(
        new Error(
          'Please match your password to the rules above for your enhanced security'
        )
      )
  }

  const value = await validateAndCheckPermission(req, next, requestSchema, 'body')
  
  const existingUser = await UserService.findByEmail(value.email)

  if (!existingUser) {
    return res.status(httpStatus.NOT_FOUND).json({ msg: "user account does not exist"})
  }

  if (value.code !== "1234") {
    return res.status(httpStatus.BAD_REQUEST).json({ msg: "invalid verification token"})
  }

  const passwordHash = await bcrypt.hash(value.newPassword, 10)

  await UserModel.updateOne({ email: value.email, password: passwordHash })

  return res.status(httpStatus.OK).json({ msg: "password reset successful"})
}