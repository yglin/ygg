module.exports = {
  name: 'recycle-cup',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/recycle-cup',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
