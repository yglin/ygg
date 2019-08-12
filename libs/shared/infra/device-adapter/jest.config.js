module.exports = {
  name: 'shared-infra-device-adapter',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/infra/device-adapter',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
