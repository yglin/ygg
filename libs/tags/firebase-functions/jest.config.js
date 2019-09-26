module.exports = {
  name: 'tags-firebase-functions',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/firebase-functions',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
