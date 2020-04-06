module.exports = {
  name: 'order',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/order',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
