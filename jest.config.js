{
  "testMatch": ["**/tests/**/*.test.js"],
  "testPathIgnorePatterns": ["/node_modules/", "/.next/"],
  "modulePathIgnorePatterns": ["/.next/", "/out/"],
  "collectCoverageFrom": [
    "app/**/*.js",
    "!app/**/*.test.js",
    "!app/**/*.spec.js"
  ]
}
