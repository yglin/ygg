module.exports = {
  name: 'shared-infra-device-adapter',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/infra/device-adapter',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
