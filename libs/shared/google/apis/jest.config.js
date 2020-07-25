module.exports = {
  name: 'shared-google-apis',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/google/apis',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
