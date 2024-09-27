import { Request, Response, NextFunction } from "express";
import logger from "../common/services/logger";

/**
 * Express Middleware that logs incoming HTTP requests.
 */
export default (req: Request, res: Response, next: NextFunction) => {
	// If the request is from K8s don't log it (for now) to avoid too much chatter in the logs
	if (/kube-probe/i.test(req.headers["user-agent"])) return next();

	logger.debug(req);
	next();
};
