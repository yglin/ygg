module.exports = {
  name: 'shared-types',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/types',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/number-range-control*.spec.ts']
};
