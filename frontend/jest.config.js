module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/buyer/", "buyerSignup.test.js"],
};
