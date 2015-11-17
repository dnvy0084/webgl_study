var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var watch = require( "gulp-watch" );
var del = require( "del" );

var paths = {
    src: [ "src/**/*.js", "test/**/*.js" ]
};

gulp.task( "del", function(){
   return del( [ "build/js" ] );
});

gulp.task( "build", ["del"], function(){

    gulp.src( paths.src)
        .pipe( concat( "build.all.js") )
        .pipe( gulp.dest( "build/js" ) );
});

gulp.task( "watch", function(){
   gulp.watch( paths.src, ["build"] );
});

gulp.task( "default", [ "build" ] );