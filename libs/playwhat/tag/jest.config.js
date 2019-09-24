module.exports = {
  name: 'playwhat-tag',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/tag',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/firebase-functions/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json']
};
