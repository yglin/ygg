module.exports = {
  name: 'user',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/user',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  // testMatch: ['**/route-guards/**.service.spec.ts']
};
