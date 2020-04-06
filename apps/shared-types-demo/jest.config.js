module.exports = {
  name: 'shared-types-demo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/shared-types-demo',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
