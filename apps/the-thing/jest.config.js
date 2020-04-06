module.exports = {
  name: 'the-thing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/the-thing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
