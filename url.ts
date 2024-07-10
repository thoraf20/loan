import express from "express";
import { registerHandler, verifyEmail } from "./src/routes/auth";

const router = express.Router()

router.post('/register', registerHandler)
router.post('/email/verify', verifyEmail)

export default router;