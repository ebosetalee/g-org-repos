import { Router } from "express";
import github from "../controllers/github.controller";

const userRouter = Router();

userRouter.get("/repos", github.getRepositories);

export default userRouter;
