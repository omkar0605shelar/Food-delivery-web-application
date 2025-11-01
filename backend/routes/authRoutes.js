import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", authRouter.signUp);
authRouter.post('/signup', authRouter.signIn);
authRouter.post("/signout", authRouter.signOut);

export default authRouter;