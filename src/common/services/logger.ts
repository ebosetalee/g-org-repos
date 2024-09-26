import env from "../config/env";
import { format, transports, createLogger, config } from "winston";
const { combine, errors, json, timestamp, cli, splat } = format;

const transport = [];
if (env.node_env !== "development") {
	transport.push(new transports.Console());
} else {
	transport.push(new transports.Console({ format: combine(cli(), splat()) }));
}

const logger = createLogger({
	level: "debug",
	levels: config.npm.levels,
	format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), splat(), json()),
	transports: transport
});

export default logger;
