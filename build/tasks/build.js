var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var notify = require('gulp-notify');
var typescript = require('gulp-typescript');
var exec = require('child_process').exec;
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var path = require('path');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
var typescriptCompiler = typescriptCompiler || null;
gulp.task('build-system', function () {
    if (!typescriptCompiler) {
        typescriptCompiler = typescript.createProject('tsconfig.json', {
            "typescript": require('typescript')
        });
    }

    return gulp.src(paths.dtsSrc.concat(paths.source))
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(changed(paths.output, {extension: '.ts'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(typescript(typescriptCompiler))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: 'src'}))
        .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
    return gulp.src(paths.html)
        .pipe(changed(paths.output, {extension: '.html'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-locales', function () {
    return gulp.src(paths.locales)
        .pipe(changed(paths.output, {extension: '.json'}))
        .pipe(gulp.dest(paths.output + 'locales/'));
});

// copies changed html files to the output directory
gulp.task('build-dts', function () {
    return gulp.src(paths.dtsPath)
        .pipe(changed(paths.output, {extension: '.d.ts'}))
        .pipe(concat('aurelia-editables.d.ts'))
        .pipe(gulp.dest(paths.output));
});

// copies changed css files to the output directory
gulp.task('build-css', function () {
    return gulp.src([
        paths.cssRoot + 'aurelia-editables.css',
    ])
        .pipe(changed(paths.cssOutput, {extension: '.css'}))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.cssOutput));
});

// copies changed css files to the output directory
gulp.task('build-less', function () {
    return gulp.src([
        paths.lessRoot + 'template.less',
    ])
        .pipe(changed(paths.cssRoot, {extension: '.less'}))
        .pipe(less())
        .pipe(concat('aurelia-editables.css'))
        .pipe(gulp.dest(paths.cssRoot));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        ['build-system', 'build-dts', 'build-html', 'build-locales', 'build-less', 'build-css'],
        callback
    );
});
