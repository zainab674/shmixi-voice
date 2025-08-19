import express from "express";
import livekitRoute from "./livekitRoute.js";
import leadRoute from "./leadRoute.js";

const router = express.Router();

router.use("/livekit", livekitRoute);
router.use("/leads", leadRoute);

export default router;