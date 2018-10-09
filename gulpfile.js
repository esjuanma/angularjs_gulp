const gutil = require('gulp-util');
const browserify = require('browserify');
const rename = require('gulp-rename');
const inject = require('gulp-inject');
const iife = require('gulp-iife');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const Server = require('karma').Server;
const babel = require('gulp-babel');
const sourceFolder = 'src';
const devFolder = 'dev';

gulp.task('default', ['dev'], () => {
    browserSync.init({ server: { baseDir: devFolder } });

    gulp.watch(`${sourceFolder}/components/**`, ['components-watch']);
    gulp.watch(`${sourceFolder}/css/*.scss`, ['sass-watch']);
    gulp.watch(`${sourceFolder}/js/**/*.js`, ['js-watch']);
    gulp.watch(`${sourceFolder}/images/**`, ['image-watch']);
    gulp.watch(`${sourceFolder}/**/*.html`, ['html-watch']);
});

gulp.task('dev', ['modules', 'components-templates', 'html', 'image', 'sass', 'js']);

gulp.task('modules',
    () => gulp
        .src(`${sourceFolder}/modules/**`)
        .pipe(plumber())
        .pipe(gulp.dest(`${devFolder}/modules`))
        .pipe(browserSync.stream())
);

gulp.task('components-templates',
    () => gulp
        .src(`${sourceFolder}/components/**/*.html`)
        .pipe(plumber())
        .pipe(gulp.dest(`${devFolder}/components`))
        .pipe(browserSync.stream())
);

gulp.task('html',
    () => gulp
        .src(`${sourceFolder}/*.html`)
        .pipe(plumber())
        .pipe(gulp.dest(devFolder))
        .pipe(browserSync.stream())
);

gulp.task('image',
    () => gulp
        .src(`${sourceFolder}/images/*`)
        .pipe(plumber())
        .pipe(gulp.dest(`${devFolder}/images`))
        .pipe(browserSync.stream())
);

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass',
    () => gulp
        .src(`${sourceFolder}/css/app.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(`${devFolder}/css`))
        .pipe(browserSync.stream())
);

gulp.task('js',
    () => gulp
        .src([`${sourceFolder}/js/**/*.js`, `${sourceFolder}/components/**/*.js`])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(`${devFolder}/js`))
);

gulp.task('image-watch', ['image'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('components-watch', ['components-templates', 'js'], (done) => {
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
