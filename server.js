const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const players = new Map();
let currentPlayer = 1;
let gameInProgress = false;
let playerCount = 0;

const questions = [
    { question: "Hangi takımda Hagi forma giymiştir?", answer: "galatasaray" },
    { question: "Alex hangi takımda oynamıştır?", answer: "fenerbahce" },
    // Daha fazla soru eklenebilir
];

io.on('connection', (socket) => {
    if (players.size < 2) {
        playerCount++;
        players.set(socket.id, {
            id: socket.id,
            score: 0,
            playerNumber: players.size + 1
        });

        io.emit('player-joined', playerCount);

        if (players.size === 2) {
            gameInProgress = true;
            io.emit('game-start');
            startGame();
        }
    }

    socket.on('answer', (answer) => {
        if (gameInProgress) {
            checkAnswer(socket.id, answer);
        }
    });

    socket.on('disconnect', () => {
        if (players.has(socket.id)) {
            playerCount--;
            players.delete(socket.id);
            gameInProgress = false;
            io.emit('player-joined', playerCount);
            io.emit('game-ended', 'Bir oyuncu ayrıldı');
        }
    });
});

function startGame() {
    const question = getRandomQuestion();
    io.emit('new-question', {
        question: question.question,
        currentPlayer: currentPlayer
    });
    startTimer();
}

function startTimer() {
    let timeLeft = 10;
    const timer = setInterval(() => {
        timeLeft--;
        io.emit('timer', timeLeft);
        
        if (timeLeft === 0) {
            clearInterval(timer);
            switchPlayer();
            startGame();
        }
    }, 1000);
}

http.listen(3000, () => {
    console.log('Server çalışıyor: http://localhost:3000');
}); 