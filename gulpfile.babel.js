import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import sass from "gulp-sass";
import concat from "gulp-concat";
import minifyCSS from "gulp-minify-css";

const sync = browserSync.create();

gulp.task("default",["watch"]);

gulp.task("script", () => {
  return browserify("./src/app.js")
  .transform("babelify")
  .bundle()
  .on("error", (error) => {
    console.error("\nError: "+error.message+" \n");
    this.emit("end");
  })
  .pipe(source("bundle.min.js"))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest("./public/dist"));
});

gulp.task("style", ()=>{
  gulp.src('./style/app.sass')
  .pipe(sass())
  .pipe(minifyCSS())
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest('./public/dist'))
});


gulp.task('serve', ['script', 'style'], () => sync.init({ server: './public' }))
gulp.task('js-watch', ['script'], () => sync.reload());
gulp.task('css-watch',['style'], () => sync.reload());

gulp.task('watch', ['serve'], () => {
  gulp.watch('./src/**/*', ['js-watch'])
  gulp.watch('./style/**/*', ['css-watch'])
  gulp.watch('./public/index.html', sync.reload)
});
