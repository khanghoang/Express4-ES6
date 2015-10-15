var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var nodemon = require('gulp-nodemon');

gulp.task("babel", function () {
  return gulp.src("app/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(babel({
    optional: ['runtime', 'es7.classProperties'],
    stage: 0
  }))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest("dist"))
});



gulp.task('default', function() {
  nodemon({
      script: 'dist/server.js'
    , watch: 'app/'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    , tasks: ['babel']
    })
})
