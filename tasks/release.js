//DIST:

gulp.task('image-min', function() {
    gulp.src(['./public/**/*.png', './public/**/*.jpg', './public/**/*.gif', './public/**/*.jpeg'])
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/public'));
});

gulp.task('babel', () =>
    gulp.src(['./public/js/config/app.js', './public/js/factories/**/*.js', './public/js/services/**/*.js', './public/js/controllers/**/*.js', './public/js/filters/**/*.js', './public/js/directives/**/*.js'])
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('./public/js/min/'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/min/'))
);

gulp.task('uglify-js', function() {
    return gulp.src(['./public/js/config/app.js', './public/js/factories/**/*.js', './public/js/services/**/*.js', './public/js/controllers/**/*.js', './public/js/filters/**/*.js', './public/js/directives/**/*.js'])
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./public/js/min/'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/min/'));
});

gulp.task('index:dist', function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./bower_components/**/*.js', './public/js/min/anonymous.min.js', './bower_components/**/*.css', './public/css/**/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./dist'))
});

gulp.task('dist:iife', function() {
    return gulp.src('./public/js/min/all.min.js')
        .pipe(iife())
        .pipe(rename('./js/min/anonymous.min.js'))
        .pipe(gulp.dest('./public'))
        .pipe(gulp.dest('./dist/public'));
});

gulp.task('serve:dist', ['dist:package'], function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    /* If you use a proxy replace the previous code with the below script replacing 'yourlocal.dev' with your local proxy
        browserSync.init({
            proxy: 'yourlocal.dev'
        });
   */

    gulp.watch('./scss/*.scss', ['sass-watch']);
    gulp.watch('./public/images/*', ['image-watch']);
    gulp.watch('./public/**/*.html', ['html-watch']);
    gulp.watch('./public/js/**/*.js', ['js-watch']);
    gulp.watch('./bower_components/**/*.js', ['bower']);
});

gulp.task('dist:package', ['sass', 'bower', 'babel', 'image', 'image-min', 'html', 'dist:iife', 'index:dist']);
