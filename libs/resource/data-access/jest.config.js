module.exports = {
  name: 'resource-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/resource/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
