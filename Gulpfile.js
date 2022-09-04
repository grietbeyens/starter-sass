var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var input = './assets/scss/*.scss';
var output = './assets/css';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ["defaults"]
};

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(output))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch(input, gulp.series('sass'))
    // When there is a change,
    // log a message in the console
    .on('change', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('serve', gulp.series('sass', function () {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("assets/scss/**/*.scss", gulp.series('sass'));
  gulp.watch("*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));

gulp.task('prod', function () {
  return gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output));
});
