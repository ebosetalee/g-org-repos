import http from "http";
import env from "./common/config/env";
import logger from "./common/services/logger";
import App from "./app";
import db from "./common/config/database";

const start = async () => {
    try {
        const app = new App();
        const appServer = app.getServer();
        const httpServer = http.createServer(appServer);

        await db.connect();
        logger.info("📦  MongoDB Connected!");

        httpServer.listen(env.port);
        httpServer.on("listening", () => logger.info(`🚀  Server running in ${env.app_env}. Listening on http://localhost:${env.port}`));

    } catch (err) {
        logger.error("Fatal server error", err);
    }
};

start();
