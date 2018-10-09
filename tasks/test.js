/* TDD
***********/

/* Run test once and exit */
gulp.task('spec', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/* Watch for file changes and re-run tests on each change */

gulp.task('serve:spec', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
