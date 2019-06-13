module.exports = {
  name: 'shared-infra-log',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/infra/log',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
