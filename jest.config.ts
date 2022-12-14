module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  transform: {
    'src/^.+\\.(ts)?$': 'ts-jest',
    "src/^.+\\.(js)$": "babel-jest",
  },
  roots: ['<rootDir>/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    'node_modules/'
  ],
  // globalSetup: '<rootDir>/test/globalSetup.ts',
  // globalTeardown: '<rootDir>/test/globalTeardown.ts',
  // setupFilesAfterEnv: [
  //   '<rootDir>/test/setupFile.ts',
  // ],
  moduleDirectories: ['<rootDir>/../node_modules', '<rootDir>']
}
