import "dotenv/config";

/**
 * Environment variables required for all environments (development, test, staging, production)
 */
const requiredVariables = ["port"];

/**
 * Environment variables required for both staging and production
 */
const productionAndStagingVariables = ["mongo_url", "jwt_secret", "jwt_expiration"];

/**
 * Requires MongoDB in production and staging, else uses MongoDB connection string directly in dev or any other environment
 */
if (["production", "staging"].includes(process.env.NODE_ENV)) requiredVariables.push(...productionAndStagingVariables);
else requiredVariables.push("mongo_url");

const env = {
	/**
	 * NodeJS runtime environment. See here https://stackoverflow.com/a/16979503
	 * Possible values are "development" and "production".
	 */
	node_env: process.env.NODE_ENV || "staging",

	/**
	 * This application's runtime environment
	 * Possible values are "development", "test", "production", "staging"
	 */
	app_env: process.env.APP_ENV || "staging",

	port: Number(process.env.PORT),
	mongo_url: process.env.MONGO_URL,

	jwt_secret: process.env.JWT_SECRET,
	jwt_expiration: process.env.JWT_EXPIRATION,
	github_token: process.env.GITHUB_API_TOKEN
};

const missingVariables = requiredVariables.reduce(
	(acc, varName) => (!env[varName] ? acc.concat(varName.toUpperCase()) : acc),
	[]
);

if (missingVariables.length) throw new Error(`The following required variables are missing: ${missingVariables}`);

export default env;
