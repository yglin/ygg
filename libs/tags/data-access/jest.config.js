module.exports = {
  name: 'tags-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
