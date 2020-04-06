module.exports = {
  name: 'the-thing-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/the-thing/ui',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
