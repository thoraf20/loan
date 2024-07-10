import Joi from 'joi'
import httpStatus from 'http-status-codes'
import { APIError } from './index'
import { NextFunction, Request, Response } from 'express'
export const validateAndCheckPermission = async (
  req: Request,
  next: NextFunction,
  schema,
  paramsLocation: string
) => {

  const requestSchema = Joi.object(schema)

  let parameter: any

  switch (paramsLocation) {
    case 'body':
      parameter = req.body
      break
    case 'query':
      parameter = req.query
      break
    default:
      parameter = req.params
  }

  const { error, value } = requestSchema.validate(parameter)

  if (error) {
    return next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      })
    )
  }

  return value
}
