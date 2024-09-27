import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 20, // Limit each IP to 20 requests per `window`.
    validate: { trustProxy: false, xForwardedForHeader: false }
});

export default limiter;
