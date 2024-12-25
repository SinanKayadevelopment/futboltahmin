const socket = io();

const answerInput = document.getElementById('answer');
const questionDiv = document.getElementById('question');
const timerDiv = document.getElementById('timer');
const score1Div = document.getElementById('score1');
const score2Div = document.getElementById('score2');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const player1Status = document.getElementById('player1-status');
const player2Status = document.getElementById('player2-status');

socket.on('new-question', (data) => {
    questionDiv.textContent = data.question;
    document.getElementById('current-player').textContent = `Sıra: Oyuncu ${data.currentPlayer}`;
    answerInput.value = '';
});

socket.on('timer', (time) => {
    timerDiv.textContent = time;
});

socket.on('update-scores', (scores) => {
    score1Div.textContent = scores.player1;
    score2Div.textContent = scores.player2;
});

socket.on('player-joined', (playerCount) => {
    if (playerCount >= 1) {
        player1Status.textContent = '✅';
    }
    if (playerCount >= 2) {
        player2Status.textContent = '✅';
    }
});

socket.on('game-start', () => {
    waitingScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        socket.emit('answer', answerInput.value.toLowerCase());
        answerInput.value = '';
    }
}); 