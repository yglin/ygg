module.exports = {
  name: 'shopping-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/factory',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
