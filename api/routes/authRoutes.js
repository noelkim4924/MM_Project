import express from "express";
import { signup, login, logout, changePassword } from "../controllers/authController.js"; // Import changePassword
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", protectRoute, changePassword); // Use changePassword

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;