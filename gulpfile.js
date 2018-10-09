var gulp = require(`gulp`);
var gutil = require(`gulp-util`);
var browserSync = require(`browser-sync`).create();
var uglify = require(`gulp-uglify`);
var browserify = require(`browserify`);
var concat = require(`gulp-concat`);
var sass = require(`gulp-sass`);
var rename = require(`gulp-rename`);
var inject = require(`gulp-inject`);
var imagemin = require(`gulp-imagemin`);
var iife = require("gulp-iife");
var cleanCSS = require(`gulp-clean-css`);
var Server = require(`karma`).Server;
const babel = require(`gulp-babel`);
const sourceFolder = `./src`;
const devFolder = `./dev`;

gulp.task(`default`, [`serve`]);

// gulp.task(`init`, [`sass`, `js`, /*`uglify-js`,*/ `image`, `image-min`, `html`, `index`]);

// Static Server + watching js/scss/html files
gulp.task(`serve`, function () {
    /*  If you use a proxy replace the next code with the below script replacing `yourlocal.dev` with your local proxy
        browserSync.init({
            proxy: `yourlocal.dev`
        }); */

    browserSync.init({
        server: {
            baseDir: `${devFolder}`
        }
    });

    gulp.watch(`${sourceFolder}/css/*.scss`, [`sass-watch`]);
    gulp.watch(`${sourceFolder}/js/**/*.js`, [`js-watch`]);
    gulp.watch(`${sourceFolder}/images/*`, [`image-watch`]);
    gulp.watch(`${sourceFolder}/**/*.html`, [`html-watch`]);
});


gulp.task(`index`, function () {
    var target = gulp.src(`${devFolder}/index.html`);
    var sources = gulp.src([`${sourceFolder}/js/config/app.js`, `${sourceFolder}/js/factories/**/*.js`, `${sourceFolder}/js/services/**/*.js`, `${sourceFolder}/js/controllers/**/*.js`, `${sourceFolder}/js/filters/**/*.js`, `${sourceFolder}/js/directives/**/*.js`, `${sourceFolder}/css/**/*.css`], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest(`${devFolder}`))
});

gulp.task(`html`,
    () => gulp.src(`${sourceFolder}/**/*.html`)
        .pipe(gulp.dest(`${devFolder}`))
        .pipe(browserSync.stream())
);

gulp.task(`image`,
    () => gulp.src(`${sourceFolder}/images/*`)
        .pipe(gulp.dest(`${devFolder}/images`))
        .pipe(browserSync.stream())
);

// Compile sass into CSS & auto-inject into browsers
gulp.task(`sass`,
    () => gulp.src(`${sourceFolder}/css/*.scss`)
        .pipe(sass())
        .pipe(gulp.dest(`${devFolder}/css`))
        .pipe(browserSync.stream())
);

gulp.task(`js`, function () {
    return gulp.src(`${sourceFolder}/js/**/*.js`)
        .pipe(concat(`bundle.js`))
        .pipe(gulp.dest(`${devFolder}/js`))
});

gulp.task(`image-watch`, [`image`, `image-min`], function (done) {
    browserSync.reload();
    done();
});

gulp.task(`html-watch`, [`html`], function (done) {
    browserSync.reload();
    done();
});

gulp.task(`sass-watch`, [`sass`], function (done) {
    browserSync.reload();
    done();
});

gulp.task(`js-watch`, [`js`, `index`, `index:dist`], function (done) {
    browserSync.reload();
    done();
});

//DIST:

gulp.task(`image-min`, function () {
    gulp.src([`${sourceFolder}/**/*.png`, `${sourceFolder}/**/*.jpg`, `${sourceFolder}/**/*.gif`, `${sourceFolder}/**/*.jpeg`])
        .pipe(imagemin())
        .pipe(gulp.dest(`./dist/public`));
});

gulp.task(`babel`, () =>
    gulp.src([`${sourceFolder}/js/config/app.js`, `${sourceFolder}/js/factories/**/*.js`, `${sourceFolder}/js/services/**/*.js`, `${sourceFolder}/js/controllers/**/*.js`, `${sourceFolder}/js/filters/**/*.js`, `${sourceFolder}/js/directives/**/*.js`])
        .pipe(concat(`all.min.js`))
        .pipe(babel({
            presets: [`@babel/env`]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(`./dist/js/`))
);

gulp.task(`uglify-js`, function () {
    return gulp.src([`${sourceFolder}/js/config/app.js`, `${sourceFolder}/js/factories/**/*.js`, `${sourceFolder}/js/services/**/*.js`, `${sourceFolder}/js/controllers/**/*.js`, `${sourceFolder}/js/filters/**/*.js`, `${sourceFolder}/js/directives/**/*.js`])
        .pipe(concat(`all.min.js`))
        .pipe(gulp.dest(`${sourceFolder}/js/min/`))
        .pipe(uglify())
        .pipe(gulp.dest(`${sourceFolder}/js/min/`));
});

gulp.task(`index:dist`, function () {
    var target = gulp.src(`./dist/index.html`);
    var sources = gulp.src([`${sourceFolder}/js/min/anonymous.min.js`, `${sourceFolder}/css/**/*.css`], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest(`./dist`))
});

gulp.task(`dist:iife`, function () {
    return gulp.src(`${sourceFolder}/js/min/all.min.js`)
        .pipe(iife())
        .pipe(rename(`./js/min/anonymous.min.js`))
        .pipe(gulp.dest(`${sourceFolder}`))
        .pipe(gulp.dest(`./dist/public`));
});

gulp.task(`serve:dist`, [`dist:package`], function () {
    browserSync.init({
        server: {
            baseDir: `./dist`
        }
    });

    /* If you use a proxy replace the previous code with the below script replacing `yourlocal.dev` with your local proxy
        browserSync.init({
            proxy: `yourlocal.dev`
        });
   */

    gulp.watch(`${sourceFolder}/scss/*.scss`, [`sass-watch`]);
    gulp.watch(`${sourceFolder}/images/*`, [`image-watch`]);
    gulp.watch(`${sourceFolder}/**/*.html`, [`html-watch`]);
    gulp.watch(`${sourceFolder}/js/**/*.js`, [`js-watch`]);
});

gulp.task(`dist:package`, [`sass`, `babel`, `image`, `image-min`, `html`, `dist:iife`, `index:dist`]);


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
