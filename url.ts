import express from "express";
import {
  sendCode,
  loginHandler,
  registerHandler,
  resetPassword,
  verifyEmail,
} from './src/routes/auth'

const router = express.Router()

router.post('/register', registerHandler)
router.post('/email/verify', verifyEmail)
router.post('/login', loginHandler)
router.post('/code/send', sendCode)
router.post('/password/reset', resetPassword)

export default router;