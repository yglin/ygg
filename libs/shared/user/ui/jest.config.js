module.exports = {
  name: 'shared-user-ui',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/user/ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
