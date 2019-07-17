module.exports = {
  name: 'playwhat-scheduler',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/scheduler',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/schedule-form/*.spec.ts']
};
