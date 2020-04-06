module.exports = {
  name: 'shopping-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/factory',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
