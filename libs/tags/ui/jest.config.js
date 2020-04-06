module.exports = {
  name: 'tags-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/ui',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/*.spec.ts']
};
