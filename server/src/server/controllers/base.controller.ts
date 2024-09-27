import { Request, Response } from "express";
import { BAD_REQUEST, OK } from "http-status";
// import { ControllerError } from "../../common/errors";
import logger from "../../common/services/logger";

interface responseData {
    message: string;
    data: object;
}
export class BaseController {
    /**
     * Handles operation success and sends a HTTP response
     * @param req Express request
     * @param res Express response
     * @param data Success data
     */
    handleSuccess = (req: Request, res: Response, data: responseData, code: number = OK) => {
        if (res.headersSent) return;

        res.status(code).json(data);
    };
    /**
     * Handles operation error, sends a HTTP response and logs the error.
     * @param req Express request
     * @param res Express response
     * @param error Error object
     * @param message Optional error message. Useful for hiding internal errors from clients.
     */
    handleError = (req: Request, res: Response, err: Error | any, message?: string) => {
        logger.error(err);
        // logger.debug(err.stack.)

        const error = {
            code: Number(err.status) || BAD_REQUEST,
            message: err.message || "Something went wrong try again later",
            metadata: err
        };

        // if (err.name == "ValidationError") {
        //     if (typeof err.message == "string") {
        //         error.message = err.message.replace(/"/g, "");
        //     } else {
        //         error.message = Object.values(err.errors)
        //             .map((value: { message: string }): string => value.message)
        //             .join(",");
        //     }
        //     error.code = err.code;
        // }

        // if (err.code === 11000) {
        //     error.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        //     error.code = CONFLICT;
        // }

        // if (err.name == "CastError") {
        //     if (err.path.match(/id/i)) {
        //         error.message = `No item found with id : ${err.value}`;
        //     } else {
        //         error.message = err.message.replace(/"/g, "");
        //     }
        //     error.code = NOT_FOUND;
        // }

        return res.status(error.code).json(error);
    };
    asyncWrapper = (fn: Function) => (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(err => {
            this.handleError(req, res, err);
        });
    };
}
