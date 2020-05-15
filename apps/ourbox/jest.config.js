module.exports = {
  name: 'ourbox',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ourbox',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
