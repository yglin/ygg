module.exports = {
  name: 'playwhat-tour',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/tour',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
