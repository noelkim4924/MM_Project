import express from "express";
import { signup, login, logout, changePassword, requestPasswordReset, resetPassword } from "../controllers/authController.js"; // Import changePassword
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", protectRoute, changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;