module.exports = {
  name: 'playwhat-resource',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/resource',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
