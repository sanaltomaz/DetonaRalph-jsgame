// Estado da aplicação
const state = {
    // Elementos da interface do usuário
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        life: document.querySelector("#life"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 30,
        totalLifes: 3,
        lastEnemySquare: null,
        timerId: null,
        countDownTimerId: null,
    },
    actions: {
        // Função para iniciar o jogo
        startGame: function () {
            // Configura o temporizador para mover o inimigo e a contagem regressiva
            this.timerId = setInterval(randomSquare, state.values.gameVelocity);
            this.countDownTimerId = setInterval(countDown, 1000);
        },
        // Função para parar o jogo
        stopGame: function () {
            // Limpa os temporizadores
            clearInterval(this.timerId);
            clearInterval(this.countDownTimerId);
        },
    },
};

// Função para atualizar a pontuação na interface do usuário
function updateScore() {
    state.view.score.textContent = state.values.result;
}

// Função para atualizar as vidas na interface do usuário
function updateLife() {
    state.view.life.textContent = state.values.totalLifes;
}

// Função para atualizar o tempo na interface do usuário
function updateTime() {
    state.view.timeLeft.textContent = state.values.curretTime;
}

// Função para a contagem regressiva do tempo do jogo
function countDown() {
    // Verifica se ainda há tempo
    if (state.values.curretTime > 0) {
        // Decrementa o tempo, atualiza na interface e ajusta a velocidade do jogo
        state.values.curretTime--;
        updateTime();
        state.values.gameVelocity -= 75;
    } else {
        // Se o tempo acabou, chama a função de fim de jogo
        gameOver();
    }
}

// Função para gerenciar cliques corretos
function handleCorrectClick() {
    // Incrementa a pontuação, atualiza na interface e reinicia a posição do inimigo
    state.values.result++;
    updateScore();
    state.values.hitPosition = null;
    playSound("hit");
}

// Função para gerenciar cliques incorretos
function handleIncorrectClick() {
    // Decrementa as vidas, atualiza na interface e verifica o fim do jogo
    state.values.totalLifes--;
    updateLife();
    gameOver();
}

// Função para reproduzir um som
function playSound(audioName) {
    let audio = new Audio(`./src/sounds/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

// Função para gerar uma nova posição aleatória para o inimigo
function randomSquare() {
    // Remove a pré-determinação do inimigo de qualquer quadrado
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Escolhe um número aleatório enquanto a última posição for a mesma da escolhida
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 9);
    } while (randomNumber === state.values.lastEnemySquare);

    // Identifica o quadrado pelo número sorteado, adiciona a classe "Enemy" e troca os valores de posições
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
    state.values.lastEnemySquare = randomNumber;
}

// Função para reiniciar os valores do jogo após o fim do jogo
function resetGameSets() {
    state.values.curretTime = 30;
    state.values.totalLifes = 3;
    state.values.result = 0;
    state.values.gameVelocity = 1000;
    updateTime();
    updateLife();
    updateScore();
}

// Função para verificar o fim do jogo
function gameOver() {
    // Verifica se as vidas restantes ou o tempo restante chegou a 0
    if (state.values.totalLifes === 0 || state.values.curretTime === 0) {
        // Exibe mensagem de acordo com a condição de término
        if (state.values.totalLifes === 0) {
            alert("Sua pontuação foi de: " + state.values.result + "\nJogo encerrado. Você perdeu suas vidas!");
        }
        if (state.values.curretTime === 0) {
            alert("Sua pontuação foi de: " + state.values.result + "\nJogo encerrado. Seu tempo acabou!");
        }

        // Reinicia o jogo
        resetGame();
    }
}

// Função para reiniciar o jogo
function resetGame() {
    state.actions.stopGame(); // Para o jogo
    resetGameSets(); // Reinicia os valores
    state.actions.startGame(); // Inicia o jogo novamente
}

// Função para chegar os cliques 
function checkClicks() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            // Verifica se o clique ocorreu na posição correta
            if (square.id === state.values.hitPosition) {
                handleCorrectClick();
            } else {
                handleIncorrectClick();
            }
        });
    });
}

// Função para adicionar ouvintes de eventos
function init() {
    checkClicks();
    // Inicia o jogo
    state.actions.startGame();
}

// Inicia o jogo ao carregar a página
init();
