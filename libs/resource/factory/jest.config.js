module.exports = {
  name: 'resource-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/resource/factory',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
