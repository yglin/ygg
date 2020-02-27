module.exports = {
  name: 'playwhat-tour',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/playwhat/tour',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
