module.exports = {
  name: 'playwhat-play',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/play',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/admin-play-tags/*.spec.ts']
};
