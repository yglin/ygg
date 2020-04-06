module.exports = {
  name: 'resource-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/resource/factory',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
