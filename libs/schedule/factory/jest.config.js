module.exports = {
  name: 'schedule-factory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/schedule/factory',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
