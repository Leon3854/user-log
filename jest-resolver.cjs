const { defaultResolver } = require("jest-resolve");

module.exports = (request, options) => {
  // Обрабатываем @src/ импорты
  if (request.startsWith("@src/")) {
    const tsPath = request
      .replace("@src/", "<rootDir>/src/")
      .replace(/\.js$/, ".ts");
    try {
      return defaultResolver(tsPath, options);
    } catch (e) {
      return defaultResolver(request, options);
    }
  }
  return defaultResolver(request, options);
};
