//. app.js

var express = require( 'express' );
var app = express();

var fs = require( 'fs' );

var Canvas = require( 'canvas' ),
    Image = Canvas.Image;

var cfenv = require( 'cfenv' );
var appEnv = cfenv.getAppEnv();

app.use( express.static( __dirname + '/public' ) );

app.get( '/generate_image', function( req, res ){
  if( req.query.filename ){
    var filename = req.query.filename;
    var img = new Image;
    var canvas = new Canvas( 300, 300 );
    var ctx = canvas.getContext( '2d' );

    ctx.beginPath();
    ctx.moveTo( 100, 100 );
    ctx.lineTo( 200, 200 );
    ctx.strokeStyle = 'red';
    ctx.stroke();

    //ctx.font = 'bold 14px "さざなみゴシック"';
    //ctx.font = 'bold 14px "Sazanami Gothic"';
    //ctx.font = 'bold 14px "sans-serif"';
    //ctx.font = '"さざなみゴシック"';
    //ctx.font = '"Takao Pゴシック"';
    //ctx.font = '"/home/vcap/app/.fonts/sazanami-gothic.ttf"';

    var Font = Canvas.Font;
    var myFont = new Font( 'myFont', 'fonts/sazanami-gothic.ttf' );
    ctx.addFont( myFont );
    ctx.font = '20px myFont';
    ctx.fillText( "ハローワールド！", 10, 30 );

    var b64 = canvas.toDataURL().split( ',' )[1];
    var buf = new Buffer( b64, 'base64' );
    fs.writeFile( __dirname + '/public/' + filename, buf, function(){
      res.redirect( '/' + filename );
    });
  }else{
    res.write( 'Specify filename=xxxx' );
    res.end();
  }
});

app.listen( appEnv.port );
console.log( "server is running on " + appEnv.port + " ..." );


