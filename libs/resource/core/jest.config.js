module.exports = {
  name: 'resource-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/resource/core',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
