module.exports = {
  name: 'shared-form-controls',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/form-controls',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
