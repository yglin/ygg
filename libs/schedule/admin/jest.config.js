module.exports = {
  name: 'schedule-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/admin',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
