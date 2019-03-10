module.exports = {
  name: 'payment',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/payment',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
