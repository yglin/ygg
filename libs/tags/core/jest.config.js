module.exports = {
  name: 'tags-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/core',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
