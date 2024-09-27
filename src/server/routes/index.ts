import { Router } from "express";
import githubRouter from "./github.routes";

const v1Router = Router();

v1Router.use("/github", githubRouter);

export default v1Router;
