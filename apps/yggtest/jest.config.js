module.exports = {
  name: 'yggtest',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/yggtest/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
