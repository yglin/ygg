module.exports = {
  name: 'schedule-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
