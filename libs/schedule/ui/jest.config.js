module.exports = {
  name: 'schedule-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
