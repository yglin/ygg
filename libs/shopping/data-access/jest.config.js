module.exports = {
  name: 'shopping-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
