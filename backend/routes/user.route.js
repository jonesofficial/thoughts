import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getProfile, searchUsers } from "../controllers/user.controller.js";
import { followUnfollowUser } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);
router.get("/search", protectRoute, searchUsers);

export default router;
