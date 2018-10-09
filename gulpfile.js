var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var imagemin = require('gulp-imagemin');
var iife = require("gulp-iife");
var cleanCSS = require('gulp-clean-css');
var Server = require('karma').Server;
const babel = require('gulp-babel');
const sourceFolder = './src';
const devFolder = './dev';

gulp.task('default', ['dev'], () => {
    browserSync.init({ server: { baseDir: devFolder } });

    gulp.watch(`${sourceFolder}/components/*`, ['components-watch']);
    gulp.watch(`${sourceFolder}/css/*.scss`, ['sass-watch']);
    gulp.watch(`${sourceFolder}/js/**/*.js`, ['js-watch']);
    gulp.watch(`${sourceFolder}/images/*`, ['image-watch']);
    gulp.watch(`${sourceFolder}/**/*.html`, ['html-watch']);
});

gulp.task('dev', ['modules', 'components', 'html', 'image', 'sass', 'js']);

gulp.task('modules',
    () => gulp.src(`${sourceFolder}/modules/**`)
        .pipe(gulp.dest(`${devFolder}/modules`))
        .pipe(browserSync.stream())
);

gulp.task('components',
    () => gulp.src(`${sourceFolder}/components/**`)
        .pipe(gulp.dest(`${devFolder}/components`))
        .pipe(browserSync.stream())
);

gulp.task('html',
    () => gulp.src(`${sourceFolder}/*.html`)
        .pipe(gulp.dest(devFolder))
        .pipe(browserSync.stream())
);

gulp.task('image',
    () => gulp.src(`${sourceFolder}/images/*`)
        .pipe(gulp.dest(`${devFolder}/images`))
        .pipe(browserSync.stream())
);

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass',
    () => gulp.src(`${sourceFolder}/css/*.scss`)
        .pipe(sass())
        .pipe(gulp.dest(`${devFolder}/css`))
        .pipe(browserSync.stream())
);

gulp.task('js',
    () => gulp.src(`${sourceFolder}/js/**/*.js`)
        .pipe(concat(`bundle.js`))
        .pipe(gulp.dest(`${devFolder}/js`))
        .pipe(browserSync.stream())
);

gulp.task('image-watch', ['image'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('components-watch', ['components'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('html-watch', ['html'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('sass-watch', ['sass'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['js'], (done) => {
    browserSync.reload();
    done();
});

//DIST:

gulp.task('image-min', function () {
    gulp.src([`${sourceFolder}/**/*.png`, `${sourceFolder}/**/*.jpg`, `${sourceFolder}/**/*.gif`, `${sourceFolder}/**/*.jpeg`])
        .pipe(imagemin())
        .pipe(gulp.dest(`./dist/public`));
});

gulp.task('build', ['dev'], () =>
    gulp.src(`${devFolder}/**/*.js`)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify())
        .pipe(gulp.dest('dev'))
);


/* TDD
***********/

/* Run test once and exit */
gulp.task(`spec`, function (done) {
    new Server({
        configFile: __dirname + `/karma.conf.js`,
        singleRun: true
    }, done).start();
});

/* Watch for file changes and re-run tests on each change */

gulp.task(`serve:spec`, function (done) {
    new Server({
        configFile: __dirname + `/karma.conf.js`
    }, done).start();
});
