module.exports = {
  name: 'playwhat',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/playwhat/',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
