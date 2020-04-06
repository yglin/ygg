module.exports = {
  name: 'playwhat-play',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/play',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/*.spec.ts']
};
