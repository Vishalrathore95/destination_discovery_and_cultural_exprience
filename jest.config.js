module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.jsx',
  ],
  // Let Jest auto-detect babel-jest as the default transformer
  // (avoids Windows path-with-parentheses resolution bug)
};
