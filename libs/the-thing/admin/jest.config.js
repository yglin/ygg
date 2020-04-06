module.exports = {
  name: 'the-thing-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/the-thing/admin',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
