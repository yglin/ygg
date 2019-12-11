module.exports = {
  name: 'the-thing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/the-thing',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
