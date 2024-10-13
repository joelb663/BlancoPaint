import express from "express";
import { getUser, updateUser, getUserEmail } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);

router.get("/:id/email", verifyToken, getUserEmail);

/* UPDATE */
router.patch("/:id/updateUser", verifyToken, updateUser);

export default router;