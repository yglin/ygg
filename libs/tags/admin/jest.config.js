module.exports = {
  name: 'tags-admin',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/admin',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/*.spec.ts']
};
