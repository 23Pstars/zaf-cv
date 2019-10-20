const fs = require('fs'),
    gulp = require('gulp'),
    mustache = require('gulp-mustache'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    banner = require('gulp-banner'),
    sass = require('gulp-sass'),
    injectCss = require('gulp-inject-css'),

    __banner = fs.readFileSync('./src/banner.txt');

gulp.task('style', done => {
    gulp.src('./src/style.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./src'));
    done();
});

gulp.task('tpl', done => {
    gulp
        .src('./src/index.html')
        .pipe(injectCss())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(banner('<!--<%= __b %>-->', { '__b': __banner }))
        .pipe(rename('index.tpl'))
        .pipe(gulp.dest('./dist'));
    done();
});

gulp.task('html', done => {
    gulp
        .src('./src/index.html')
        .pipe(mustache('./src/data.json'))
        .pipe(injectCss())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(banner('<!--<%= __b %>-->', { '__b': __banner }))
        .pipe(gulp.dest('./dist'));
    done();
});

gulp.task('default', gulp.series(['style', 'tpl', 'html']));

gulp.task('watch', () => {
    gulp.watch('./src/banner.txt', gulp.parallel(['tpl', 'html']));
    gulp.watch('./src/style.scss', gulp.series('style'));
    gulp.watch('./src/index.html', gulp.parallel(['tpl', 'html']));
});