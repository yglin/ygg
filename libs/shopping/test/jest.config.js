module.exports = {
  name: 'shopping-test',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/test',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
