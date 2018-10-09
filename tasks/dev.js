// Static Server + watching js/scss/html files
gulp.task('serve', ['init'], function() {
    browserSync.init({
        server: {
            baseDir: './dev'
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


gulp.task('index', function() {
    var target = gulp.src('./dev/index.html');
    var sources = gulp.src(['./bower_components/**/*.js', './public/js/config/app.js', './public/js/factories/**/*.js', './public/js/services/**/*.js', './public/js/controllers/**/*.js', './public/js/filters/**/*.js', './public/js/directives/**/*.js', './bower_components/**/*.css', './public/css/**/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./dev'))
});

gulp.task('html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(gulp.dest('./dev'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

gulp.task('image', function() {
    return gulp.src('./public/images/*')
        .pipe(gulp.dest('./dev/public/images'))
        .pipe(gulp.dest('./dist/public/images'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(gulp.dest('./dev/public/css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/public/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src('./public/js/**/*.js')
        .pipe(gulp.dest('./dev/public/js'))
});

gulp.task('bower', ['index', 'index:dist'], function() {
    return gulp.src(['./bower_components/**/*.min.js', './bower_components/**/*.min.css'])
        .pipe(gulp.dest('./dev/bower_components'))
        .pipe(gulp.dest('./dist/bower_components'));
});

gulp.task('image-watch', ['image', 'image-min'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('html-watch', ['html'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('sass-watch', ['sass', 'index', 'index:dist'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['js', 'index', 'index:dist'], function(done) {
    browserSync.reload();
    done();
});