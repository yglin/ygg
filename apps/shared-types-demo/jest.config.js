module.exports = {
  name: 'shared-types-demo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/shared-types-demo',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
