var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var watch = require( "gulp-watch" );
var order = require( "gulp-order" );
var del = require( "del" );

var paths = {
    src: [
        "src/**/*.js",
        "test/**/*.js",
    ],
    shaders: [ "shaders/**/*.cpp" ]
};

gulp.task( "del", function(){
   return del( [ "build/js" ] );
});

gulp.task( "del_shader", function(){
    return del( ["build/shader"] );
});

gulp.task( "move", ["del_shader"], function(){
    gulp.src( paths.shaders )
        .pipe( gulp.dest( "build/shader" ) );
});

gulp.task( "build", ["del"], function(){

    gulp.src( paths.src )
        .pipe( order([
            "src/namespaces.js",
            "src/srcmain.js",
            "src/**/*.js",
            "test/testcase/BaseCase.js",
            "test/**/!(testmain)*.js",
            "test/testmain.js"
        ]))
        .pipe( concat( "build.all.js" ) )
        .pipe( gulp.dest( "build/js" ) );
});

gulp.task( "watch", function(){
    gulp.watch( paths.src, ["build"] );
    gulp.watch( paths.shaders, ["move"] );
});

gulp.task( "default", [ "build" ] );