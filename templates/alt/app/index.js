#!/usr/bin/env node
var stitch  = require('stitch')
	,path    = require('path')
    ,express = require('express')
    ,util    = require('util')
    ,fs      = require('fs')
    ,stylus  = require('stylus')
    ,coffeescript  = require('coffee-script')
    ,argv    = process.argv.slice(2)
    

/*stitch.compilers.tmpl = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  content = ["var template = ", JSON.stringify(content), ";", 
             "module.exports = (function(data){ return jQuery.tmpl(template, data); });\n"].join("");
  return module._compile(content, filename);
};*/



var package = stitch.createPackage({
  paths: [
     __dirname + '/lib', __dirname + '/app'
  ]
  ,dependencies: [
      __dirname + '/lib/json2.js',
      ,__dirname + '/lib/shim.js'
      ,__dirname + '/lib/jquery.js'
      ,__dirname + '/lib/jquery.tmpl.js'
      ,__dirname + '/lib/spine.js'
      ,__dirname + '/lib/spine.tmpl.js'
      ,__dirname + '/lib/spine.manager.js'
      ,__dirname + '/lib/spine.ajax.js'
      ,__dirname + '/lib/spine.local.js'
      ,__dirname + '/lib/spine.route.js'
    ]
  });


package.compile(function (err, source) {
  fs.writeFile('public/lib/application.js', source, function (err) {
    if (err) throw err;
    
    util.puts('Compiled public/lib/application.js');
  })
});

var app = express.createServer();

app.configure(function() {
    
  app.use(stylus.middleware({
  	src: __dirname + '/app/views'
	 ,dest:     __dirname + '/public'
    ,compile: function(str, path) {
        return stylus(str)
          .set('filename', path)
          .set('compress', true)
          .set('warn', true)
          .use(require('nib')())
      }
  }));
  //app.use(express.logger());
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  
  app.use(app.router);
 
  app.get('/', function(req, res){
	var options = {
	    locals: {
	        project: 'hello'
	    }
	};
	
	res.render('index', options);
	
  });
  app.use(express.static(__dirname + '/public'));
});

var port = argv[0] || 8284;
util.puts("Starting server on port: " + port);
app.listen(port);