var appRoot = 'src/';
var outputRoot = 'dist/';
var exportSourceRoot = 'dist/';
var exportSrvRoot = 'export/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.ts',
  html: appRoot + '**/*.html',
  locales: appRoot + 'locales/**/*.json',
  cssRoot: appRoot + 'assets/',
  lessRoot: appRoot + 'assets/less/',
  cssOutput: exportSourceRoot + 'css/',
  style: 'assets/**/*.css',
  output: outputRoot,
  exportSourceRoot: exportSourceRoot,
  exportSrv: exportSrvRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/**/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  dtsSrc: [
    'typings/**/*.d.ts',
    'typings_custom/**/*.d.ts'
  ],
  dtsPath: 'typings_custom/aurelia-editables/*.d.ts'
};
