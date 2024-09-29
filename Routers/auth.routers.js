import express from 'express';
import { google, loginUser, registerUser } from '../Controllers/auth.controller.js';
const router=express.Router();
router.post("/register-auth",registerUser);
router.post("/login-auth",loginUser)
router.post("/google",google)

export default router;