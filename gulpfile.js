var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
// var nodemailer = require('nodemailer');

const paths = {
  scssSource: './public/styles/**/*.scss',
  scssDest: './public/compiled/styles',
  jsSource: ['./public/js/app.js', './public/js/**/*.js'],
  jsDest: './public/compiled/js'
};
gulp.task('styles', () => {
  return gulp.src(paths.scssSource)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('styles.css'))
  .pipe(gulp.dest(paths.scssDest));
});
gulp.task('frontjs', () => {
  return gulp.src(paths.jsSource)
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.jsDest));
});
// gulp.task('watch', () =>  {
//   gulp.watch(paths.jsSource, ['frontjs']);
//   gulp.watch(paths.scssSource, ['styles']);
// });
gulp.task('watch', () => {
  watch(paths.jsSource, {usePolling:true}, () => {
    gulp.start('frontjs')
  })
  watch(paths.scssSource, {usePolling:true}, () => {
    gulp.start('styles')
  })
})

gulp.task('default', ['watch', 'frontjs', 'styles']);
