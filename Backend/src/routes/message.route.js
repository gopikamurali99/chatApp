import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMesssage } from "../controllers/message.controller.js";

const router = express.Router();


router.get("/users",protectRoute,getUserForSidebar);
router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute,sendMesssage)

export default  router;