var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
    root: appRoot,
    source: 'transpiled/' + '**/*.js',
    html: appRoot + '**/*.html',
    cssRoot: appRoot + 'assets/css/',
    lessRoot: appRoot + 'assets/less/',
    cssOutput: outputRoot + 'css/',
    style: 'assets/**/*.css',
    tsSource: "src/**/*.ts",
    tsOutput: "transpiled/",
    output: outputRoot,
    doc: './doc',
    e2eSpecsSrc: 'test/e2e/src/*.js',
    e2eSpecsDist: 'test/e2e/dist/',
    dtsSrc: [
        'typings/**/*.d.ts',
        'typings_custom/**/*.d.ts'
    ],
    dtsPath: 'typings_custom/aurelia-editables/*.d.ts'
};
