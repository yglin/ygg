module.exports = {
  name: 'shared-infrastructure-log',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/infrastructure/log',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
