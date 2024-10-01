import { Router } from "express";
import github from "../controllers/github.controller";

const reposRouter = Router();

reposRouter.get("/repos", github.getRepositories);

reposRouter.post("/store", github.saveRepositories);

export default reposRouter;
