import express from "express";
import {
  sendCode,
  loginHandler,
  registerHandler,
  resetPassword,
  verifyEmail,
} from './src/routes/auth'
import { supportedTokenHandler } from "./src/routes/token";

const router = express.Router()

router.post('/register', registerHandler)
router.post('/email/verify', verifyEmail)
router.post('/login', loginHandler)
router.post('/code/send', sendCode)
router.post('/password/reset', resetPassword)

router.get('/token/supported', supportedTokenHandler)

export default router;