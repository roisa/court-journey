module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4 uses the react-native-worklets babel plugin.
    // This must be listed last.
    plugins: ['react-native-worklets/plugin'],
  };
};
