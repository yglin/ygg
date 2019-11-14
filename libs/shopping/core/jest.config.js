module.exports = {
  name: 'shopping-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
