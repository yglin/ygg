module.exports = {
  name: 'shared-domain-resource',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/domain/resource',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
