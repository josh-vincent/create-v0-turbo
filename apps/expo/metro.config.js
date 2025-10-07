// Learn more: https://docs.expo.dev/guides/monorepos/
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Explicitly set projectRoot to ensure Metro resolves from the correct directory
config.projectRoot = projectRoot;

// Monorepo configuration
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Ensure we resolve from the project root, not monorepo root
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// Disable symbolication for anonymous sources to prevent errors
config.symbolicator = {
  customizeFrame: (frame) => {
    // Skip frames that point to anonymous sources
    if (frame.file === "<anonymous>" || !frame.file) {
      return null;
    }
    return frame;
  },
};

// Turborepo cache first, then NativeWind
const configWithCache = withTurborepoManagedCache(config);

module.exports = withNativeWind(configWithCache, {
  input: "./src/styles.css",
  configPath: "./tailwind.config.ts",
});

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turborepo.com/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [new FileStore({ root: path.join(__dirname, ".cache/metro") })];
  return config;
}
