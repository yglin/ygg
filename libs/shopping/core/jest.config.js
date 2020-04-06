module.exports = {
  name: 'shopping-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/core',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
