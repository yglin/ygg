module.exports = {
  name: 'shared-the-thing-core',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/the-thing/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
