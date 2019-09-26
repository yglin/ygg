module.exports = {
  name: 'tags-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/admin',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
