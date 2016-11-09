//建立一个Socket服务端


const net = require('net');
var clients = [];//用于存储所有的连接
const server = net.createServer((socket) => {
    //有任何客户端发消息都会触发
    clients.push(socket);
    console.log(`Welcome ${socket.remoteAddress} to 2080 chatroom 当前在线${clients.length}人`);

    socket.on('data', clientData).on('error',(err)=>{
        // clients=clients.splice(clients.indexOf(socket),1);
        clients.pop(socket);
        if(!clients.length){
            console.log('咦，人都跑哪去了');
        }else  console.log(`${socket.remoteAddress}下线了 当前在线${clients.length}人`);
       
    })
     function clientData(chunk){
        try {
            //chunk:broadcast|张三|弄啥咧
            //chunk='{"protocol":"broadcast","from":"张三","message":"弄啥咧"}'
            //chunk='{"protocol":"p2p","from":"张三","to":"李四","message":"弄啥咧"}'
            var signal = JSON.parse(chunk.toString());
            var protocol = signal.protocol;
            switch (protocol) {
                case 'broadcast':
                    broadcast(signal);
                    break;
                // case 'p2p':
                //     p2p(signal);
                //     break;
                // case 'shake':
                //     shake(signal);
                //     break;
                default:
                    console.log('协议不对啊');
                    // socket.write('弄啥咧！你要干的我干不了~');
                    break;
            }

        } catch (err) {
            socket.write('弄啥咧!');
        }
    }
   
      
    //var username=chunk.username
    //var message=chunk.message
    //boardcast(username,message)  这是模拟代码，无法执行，理解就行

});
var port = 2080;
server.listen(port, (err) => {
    if (err) {
        console.log('端口被占用');
        return false;
    }
    console.log(`服务端正常启动监听[${port}]`)
})
function broadcast(signal) {
    //肯定有用户名和消息
    console.log(signal);
    var username = signal.from;
    var message = signal.message;
    var send = { protocol: signal.protocol, from: username, message: message }
    //广播消息
    clients.forEach(client=> {
        client.write(JSON.stringify(send));
    })
}
