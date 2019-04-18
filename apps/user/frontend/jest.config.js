module.exports = {
  name: 'user-frontend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/user/frontend/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
