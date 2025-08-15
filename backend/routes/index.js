import express from "express";
import livekitRoute from "./livekitRoute.js";

const router = express.Router();

router.use("/livekit", livekitRoute);

export default router;