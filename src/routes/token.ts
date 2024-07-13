import { RequestHandler } from "express";
import httpStatus from 'http-status-codes'
import { supportedToken } from "../lib/supporteToken";


export const supportedTokenHandler: RequestHandler = async(req, res, next) => {
  return res.status(httpStatus.OK).json({ data: supportedToken})
}