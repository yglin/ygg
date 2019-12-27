module.exports = {
  name: 'the-thing-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/the-thing/ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
