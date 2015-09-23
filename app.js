// モジュールオブジェクトの初期化
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

// 3000番portでhttpサーバーを立てる
var server =http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end(fs.readFileSync('./index.html', 'utf-8'));
}).listen(8080);

// サーバーをソケットに紐付ける
var io = socketio.listen(server);

//接続確立後の通信処理部分を定義
io.sockets.on('connection',function(socket) {

  //メッセージ送信ハンドラ（自分を含む全員宛に送る）
  socket.on( 'c2s_message', function( data ) {

    // room機能
    socket.join(data.room);

    // サーバーからクライアントへ メッセージを送り返し
    console.log(data);
    io.sockets.to(data.room).emit( 's2c_message', { value : data.value, id: socket.id } );
  });

  //メッセージ送信ハンドラ（自分以外の全員宛に送る）
  socket.on( 'c2s_broadcast', function( data ) {

    // room機能
    socket.join(data.room);
    // サーバーからクライアントへ メッセージを送り返し
    socket.broadcast.emit( 's2c_message', { value : data.value } );
  });

});
