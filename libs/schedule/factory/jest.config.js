module.exports = {
  name: 'schedule-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/factory',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
