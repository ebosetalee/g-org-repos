import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
    clearMocks: true,
    verbose: true,
    roots: [
        "./"
    ],
    preset: "ts-jest",

    moduleFileExtensions: ["ts", "tsx", "js"],

    testEnvironment: "node",

    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",

    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },

    transformIgnorePatterns: ["./node_modules/(?!@foo)"],
    detectOpenHandles: true,
    forceExit: true,
};

export default config;