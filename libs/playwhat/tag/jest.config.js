module.exports = {
  name: 'playwhat-tag',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/tag',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/*.spec.ts']
};
