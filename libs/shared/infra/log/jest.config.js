module.exports = {
  name: 'shared-infra-log',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/infra/log',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
