var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var wiredep     = require('wiredep').stream;
var inject      = require('gulp-inject');
var nodemon     = require('gulp-nodemon');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');  
var order       = require("gulp-order");
var gzip        = require('gulp-gzip');

var paths = {
    
    index : 'index.html',
    sources: ['./Client/*.js', './Client/Styles/**/*.css'],
    vendor: ['./Client/Vendor/**/*.js', './Client/Vendor/**/*.css'],
    js: ['./Client/**/*.js']
};


/* 
    TODO:
    
    Move js desitnation settings to a config 
    object. Decide how build process should Run
    
    MAYBE SEGEARTE WITH A SERVE DEV AND A SERVE BUILD
    MAKE TWO CORESPONDING TASKS
    
    MAY NEED TO SEPERATE VENDOR TASKS FROM NORMAL
    JS INJECTION TASKS.
*/

gulp.task('default', function gulpMain() {
  
    nodemon({
        script: 'server.js',
        ext: 'js',
        env:{
            port: process.env.PORT || 8081
        },
        ignore: ['./node_modules/**']
    })
    .on('restart',['Inject-Dep'],  function nodemonRestart() {
      
     
    })
    
  
     gulp.watch("./index.html", ['Inject-Dep']);
});

 
gulp.task('Inject-Dep', function(){
    
   return gulp.src(paths.index)
        .pipe(wiredep({}))
        .pipe(inject(gulp.src(paths.sources, {read: false}), {relative: true, ignorePath: 'Client'}))
        .pipe(inject(gulp.src(paths.vendor, {read: false}), {starttag: '<!-- inject-vendor:{{ext}} -->', relative: true,  ignorePath: 'Client'}))
        
        /* .pipe(inject(gulp.src(paths.js, {read: false}),{

            // Do not add a root slash to the beginning of the path
            addRootSlash: false,

            // Remove the `public` from the path when doing the injection
            ignorePath: 'client'
         })) */
       // .pipe(inject(gulp.src(paths.sources, {read: false}), {relative: true})
        .pipe(gulp.dest('./Client/'))
    
        
    
});


gulp.task('vet', function(){
    
   return  gulp.src(paths.js)
               .pipe(jshint())
               .pipe(jshint.reporter('jshint-stylish', {verbose:true}));
});      

gulp.task('Optimize-Code', function () {
    // path to js files 
    return gulp.src('./Client/os-esri-map/*.js')
        .pipe(order([
            'os-esri-module.js',
            'os-map-service.js',
            'os-esri-map/*.js'
           
            
        ]/*,   {base: './Client/Js/'} */ ))
        // concat files and return one file with name of main.js
        .pipe(concat('main.js'))
      //  .pipe(rename('main.min.js'))
      //  .pipe(uglify())
       // .pipe(gzip())
        .pipe(gulp.dest('./Client/os-esri-map/dist/'))
});

     var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var wiredep     = require('wiredep').stream;
var inject      = require('gulp-inject');
var nodemon     = require('gulp-nodemon');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');  
var order       = require("gulp-order");
var gzip        = require('gulp-gzip');

var paths = {
    
    index : 'index.html',
    sources: ['./Client/*.js', './Client/Styles/**/*.css'],
    vendor: ['./Client/Vendor/**/*.js', './Client/Vendor/**/*.css'],
    js: ['./Client/**/*.js']
};


/* 
    TODO:
    
    Move js desitnation settings to a config 
    object. Decide how build process should Run
    
    MAYBE SEGEARTE WITH A SERVE DEV AND A SERVE BUILD
    MAKE TWO CORESPONDING TASKS
    
    MAY NEED TO SEPERATE VENDOR TASKS FROM NORMAL
    JS INJECTION TASKS.
*/

gulp.task('default', function gulpMain() {
  
    nodemon({
        script: 'server.js',
        ext: 'js',
        env:{
            port: process.env.PORT || 8081
        },
        ignore: ['./node_modules/**']
    })
    .on('restart',['Inject-Dep'],  function nodemonRestart() {
      
     
    })
    
  
     gulp.watch("./index.html", ['Inject-Dep']);
});

 
gulp.task('Inject-Dep', function(){
    
   return gulp.src(paths.index)
        .pipe(wiredep({}))
        .pipe(inject(gulp.src(paths.sources, {read: false}), {relative: true, ignorePath: 'Client'}))
        .pipe(inject(gulp.src(paths.vendor, {read: false}), {starttag: '<!-- inject-vendor:{{ext}} -->', relative: true,  ignorePath: 'Client'}))
        
        /* .pipe(inject(gulp.src(paths.js, {read: false}),{

            // Do not add a root slash to the beginning of the path
            addRootSlash: false,

            // Remove the `public` from the path when doing the injection
            ignorePath: 'client'
         })) */
       // .pipe(inject(gulp.src(paths.sources, {read: false}), {relative: true})
        .pipe(gulp.dest('./Client/'))
    
        
    
});


gulp.task('vet', function(){
    
   return  gulp.src(paths.js)
               .pipe(jshint())
               .pipe(jshint.reporter('jshint-stylish', {verbose:true}));
});      

gulp.task('Optimize-Code', function () {
    // path to js files 
    return gulp.src('./Client/os-esri-map/*.js')
        .pipe(order([
            'os-esri-module.js',
            'os-map-service.js',
            'os-esri-map/*.js'
           
            
        ]/*,   {base: './Client/Js/'} */ ))
        // concat files and return one file with name of main.js
        .pipe(concat('main.js'))
      //  .pipe(rename('main.min.js'))
      //  .pipe(uglify())
       // .pipe(gzip())
        .pipe(gulp.dest('./Client/os-esri-map/dist/'))
});

     