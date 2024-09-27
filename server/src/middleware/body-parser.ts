import { ServerResponse } from "http";
import express, { NextFunction, Request, Response } from "express";
import { BodyParserError } from "../common/errors";

function bodyParser(req: Request, res: Response, next: NextFunction): void {
	express.json()(req, res as ServerResponse, err => {
		if (err) {
			return next(new BodyParserError());
		}

		next();
	});
}

export default bodyParser;