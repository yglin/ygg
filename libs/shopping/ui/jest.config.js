module.exports = {
  name: 'shopping-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shopping/ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
