module.exports = {
  name: 'playwhat-scheduler',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/scheduler',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/schedule-plan-view-page/*.spec.ts']
};
