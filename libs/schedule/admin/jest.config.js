module.exports = {
  name: 'schedule-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/admin',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
