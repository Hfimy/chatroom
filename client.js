//客户端
const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    // prompt: 'OHAI> '
});
rl.question('what is your name?', (name) => {
    name = name.trim();
    rl.setPrompt(name + '>');
    if (!name) {
        throw new Error('没名字还出来混');
    }
    //创建与服务端的连接
    var server = net.connect({port:2080,host:'172.18.19.5'}, () => {
        console.log('Welcome to 2080 chatroom');
        //监听服务端发过来的数据
        server.on('data', (chunk) => {
            try {
                // console.log(chunk);
                var signal = JSON.parse(chunk.toString());
                var protocol = signal.protocol;
                switch (protocol) {
                    case 'broadcast':
                        // console.log('\n---broadcast---');
                        console.log('/nbroadcast from '+signal.from + '>' + signal.message);
                        rl.prompt();
                    default:
                        server.write('弄啥咧！你要干的我干不了~');
                        break;
                }

            } catch (err) {
                server.write('弄啥咧!');
            }

        })
        rl.prompt();

        rl.on('line', (line) => {

            var send = { protocol: 'broadcast', from: name, message: line.toString().trim() }
            server.write(JSON.stringify(send));
            // console.log(line);
            // switch (line.trim()) {
            //     case 'hello':
            //         console.log('world!');
            //         break;
            //     default:
            //         console.log(`Say what? I might have heard '${line.trim() }'`);
            //         break;
            // }
            // rl.prompt();
        }).on('close', () => {
            // console.log('Have a great day!');
            // process.exit(0);
        });
    })
})