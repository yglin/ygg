module.exports = {
  name: 'playwhat-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/admin',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
