var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var nodemon = require('gulp-nodemon');

gulp.task("default", function () {
  return gulp.src("app/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat("all.js"))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest("dist"));
});



gulp.task('start', function() {
  nodemon({
      script: 'dist/all.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    })
})
