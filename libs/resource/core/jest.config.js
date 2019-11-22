module.exports = {
  name: 'resource-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/resource/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
