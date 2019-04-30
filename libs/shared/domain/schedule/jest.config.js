module.exports = {
  name: 'shared-domain-schedule',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/domain/schedule',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
