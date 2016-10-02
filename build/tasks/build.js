var paths = require('../paths');
var path = require('path');
var gulp = require('gulp');

var assign = Object.assign || require('object.assign');
var changed = require('gulp-changed');
var compilerOptions = require('../babel-options');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require('gulp-babel');
var typescript = require('gulp-typescript');


// transpiles changed TS files to ES6 format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
var typescriptCompiler = typescriptCompiler || null;
gulp.task('build-ts', function () {
    if (!typescriptCompiler) {
        typescriptCompiler = typescript.createProject('tsconfig.json', {
            "typescript": require('typescript')
        });
    }

    return gulp.src(paths.dtsSrc.concat(paths.tsSource))
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(changed(paths.tsOutput, {extension: '.ts'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(typescript(typescriptCompiler))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: 'src'}))
        .pipe(gulp.dest(paths.tsOutput));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.output + 'es2015'))
        .pipe(gulp.dest(paths.output + 'commonjs'))
        .pipe(gulp.dest(paths.output + 'amd'))
        .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-dts', function () {
    return gulp.src(paths.dtsPath)
        .pipe(changed(paths.output, {extension: '.d.ts'}))
        .pipe(concat('aurelia-editables.d.ts'))
        .pipe(gulp.dest(paths.output));
});

// copies changed css files to the output directory
gulp.task('build-css', function () {
    return gulp.src([
        paths.cssRoot + '**/*.css',
    ])
        .pipe(changed(paths.cssOutput, {extension: '.css'}))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.cssOutput));
});

// less processing
gulp.task('build-less', function () {
    return gulp.src([
        paths.lessRoot + 'template.less',
    ])
        .pipe(changed(paths.cssRoot, {extension: '.less'}))
        .pipe(less())
        .pipe(concat('aurelia-editables.css'))
        .pipe(gulp.dest(paths.cssRoot));
});

gulp.task('build-es2015', function () {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.es2015())))
        .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', function () {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.commonjs())))
        .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function () {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.amd())))
        .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function () {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.system())))
        .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-native-modules', function () {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions["native-modules"]())))
        .pipe(gulp.dest(paths.output + 'native-modules'));
});

gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        ['build-ts', 'build-dts', 'build-less'],
        ['build-css', 'build-html', 'build-es2015', 'build-commonjs', 'build-amd', 'build-system', 'build-native-modules'],
        callback
    );
});
