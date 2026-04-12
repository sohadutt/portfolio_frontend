// Example for .eslintrc.js / .eslintrc.cjs
module.exports = {
  plugins: ["unused-imports"],
  rules: {
    "no-unused-vars": "off", // Turn off standard rule
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ]
  }
}