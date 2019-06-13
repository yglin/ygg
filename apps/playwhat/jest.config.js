module.exports = {
  name: 'playwhat',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/playwhat/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
