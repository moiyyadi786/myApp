// Karma configuration
// Generated on Wed Apr 06 2016 21:33:19 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    
    preprocessors: {
      'www/templates/*.html': ['ng-html2js']
    },


    // list of files / patterns to load in the browser
    files: [
      "libs/angular/*.js",
      "libs/angular-mocks/*.js",
      "libs/angular-animate/*.js",
      "libs/angular-sanitize/*.js",
      "libs/angular-ui-router/*.js",
      "libs/angular-jwt/*.js",
      "libs/ionic/ionic.js",
      "libs/ionic/ionic-angular.js",
      "tests/mock/*.js",
      "tests/*.js",
      "www/js/*.js",
      "www/templates/*html"
    ],
        // list of files to exclude
    exclude: [
    ],

    ngHtml2JsPreprocessor: {
      // strip this from the file path 
      stripPrefix: 'www/',
 
      // or define a custom transform function 
      // - cacheId returned is used to load template 
      //   module(cacheId) will return template at filepath 
 
      // - setting this option will create only a single module that contains templates 
      //   from all the files, so you can load them all with module('foo') 
      // - you may provide a function(htmlPath, originalPath) instead of a string 
      //   if you'd like to generate modules dynamically 
      //   htmlPath is a originalPath stripped and/or prepended 
      //   with all provided suffixes and prefixes 
      moduleName: 'ngTemplates'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
