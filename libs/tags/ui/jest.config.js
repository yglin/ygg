module.exports = {
  name: 'tags-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/tags/ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  testMatch: ['**/*.spec.ts']
};
