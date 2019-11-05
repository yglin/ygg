module.exports = {
  name: 'schedule-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
