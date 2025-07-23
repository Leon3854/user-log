//jest-transformer.js
const { createTransformer } = require("ts-jest").default;

module.exports = createTransformer({
  tsconfig: "./tsconfig.json",
  isolatedModules: true,
});
