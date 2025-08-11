import { Router } from "express";
import {
  googleAuthCallback,
  googleAuthHandler,
  handleGoogleLoginCallback,
  handleLogout,
} from "../controllers/auth.controllers.js";

const router = Router();

router.get("/google", (req, res, next) => {
  console.log('Req host:', req.get('host'));
  console.log('Using callback env:', process.env.GOOGLE_CALLBACK_URL);
  next();
}, googleAuthHandler);
router.get("/google/callback", googleAuthCallback, handleGoogleLoginCallback);
router.get("/logout", handleLogout);

export default router;
