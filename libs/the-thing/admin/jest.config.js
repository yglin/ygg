module.exports = {
  name: 'the-thing-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/the-thing/admin',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
