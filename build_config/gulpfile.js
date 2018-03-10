const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const babel = require("gulp-babel");

gulp.task('buildAll', (done) => {
  runSequence(['buildClient', 'buildServer'], 'applyManifest', done);
});

gulp.task('buildClient', (done) => {
  webpack(require('./webpack.prod.js')).run( (err, stats) => {
    if (err) {
      gutil.log('Error', err)
    } else {
      for (const name of Object.keys(stats.compilation.assets)) {
        gutil.log('Webpack: output ', gutil.colors.green(name));
      }
      gutil.log('Webpack: ', gutil.colors.blue('finished '));
    }
    done();
  });
});

gulp.task('buildServer', () => {
  return gulp.src("src/**/*.js")
    .pipe(babel({
      "presets": ["react"]
    }))
    .pipe(gulp.dest("build_server"));
});

gulp.task('applyManifest', () => {
  return gulp.src('build/manifest.json')
    .pipe(gulp.dest('build_server'));
});
