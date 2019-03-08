module.exports = {
  name: 'deep-travel',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/deep-travel/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
