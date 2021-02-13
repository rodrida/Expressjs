const app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    redisAdapter = require('socket.io-redis'),
    session = require('express-session')({
        secret: 'my-secret',
        resave: true,
        saveUninitialized: true
    }),
    sharedsession = require('express-socket.io-session');

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));  // permite ejecutar múltiples instancias de Socket.IO en diferentes procesos o servidores que pueden transmitir y emitir eventos entre sí

// Attach session
app.use(session);

// Share session with io sockets
io.use(sharedsession(session, {
    autoSave: true
}));

// Ruta raíz
app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
    })
})

server.listen(3000, () => {
    console.log('Example app listening at http://localhost:3000');
});