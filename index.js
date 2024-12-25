const app = require('express')()
const server = require('http').createServer(app);

// setup socket. For demo, allow all origin and not config for authentication
const io = require('socket.io')(server, {cors: {
    origin: "*"
}});

const connections = [];

// init when 1 socket is activated
io.on('connection', (socket) => {
    connections.push(socket);
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    // when new user registers
    socket.on('register', data => {
        if (data.quizId !== 'quiz01') {
            return socket.emit('register_error')
        }
        // emit back to connected user 
        socket.emit('register_success');
    })

    // when user start quiz
    socket.on('start_quiz', data => {
        // emit event to all other connected users includes current user for updating leaderboard
        io.emit('new_user_start_quiz', {quizId: data.quizId, username: data.username, status: "Processing", score: 0});
    })

     // when user start quiz
    socket.on('finish_quiz', data => {
        // emit to all user connected includes current user
        io.emit('user_finish_quiz', {quizId: data.quizId, username: data.username, status: "Finished", score: data.score});
    })
});

server.listen(3000, () => {
    console.log('listent at: 3000...')
})
