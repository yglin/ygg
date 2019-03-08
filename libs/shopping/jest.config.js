module.exports = {
  name: 'shopping',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/shopping',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
