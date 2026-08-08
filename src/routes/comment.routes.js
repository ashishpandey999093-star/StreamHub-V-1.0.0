import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
} from "../controllers/comment.controller.js";


const router = Router()


router.route("/v/:videoId").post(verifyJWT,addComment).get(getVideoComments)
router.route("/c/:commentId").patch(verifyJWT,updateComment)
router.route("/c/:commentId").delete(verifyJWT,deleteComment)

export default router