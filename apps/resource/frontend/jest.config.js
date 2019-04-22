module.exports = {
  name: 'resource-frontend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/resource/frontend/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
