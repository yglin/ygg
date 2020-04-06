module.exports = {
  name: 'shared-types',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/types',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/date-range/**/*.spec.ts']
};
