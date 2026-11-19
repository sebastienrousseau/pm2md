module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/packages/*/__tests__/**/*.spec.ts"],
  moduleNameMapper: {
    "^@sebastienrousseau/pm2md-core$":
      "<rootDir>/packages/pm2md-core/src/index.ts",
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFiles: ["ts-node/register"],
};
