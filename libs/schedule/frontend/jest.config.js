module.exports = {
  name: 'schedule-frontend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/frontend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
