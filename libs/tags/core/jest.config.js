module.exports = {
  name: 'tags-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
