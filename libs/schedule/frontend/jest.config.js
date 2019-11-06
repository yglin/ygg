module.exports = {
  name: 'schedule-frontend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/frontend',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
