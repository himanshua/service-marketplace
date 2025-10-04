module.exports = {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
};
