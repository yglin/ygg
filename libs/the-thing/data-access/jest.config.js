module.exports = {
  name: 'the-thing-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/the-thing/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
