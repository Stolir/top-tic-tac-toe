const gameBoard = function(){
    const board = [];

    // for each row make 3 cells (3x3 tic-tac-toe board)
    const makeBoard = () => { 
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (j = 0; j < 3; j++) {
                board[i][j] = " ";
            }
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, column, marker) => {
        board[row][column] = marker;
    }
    
    const displayBoard = () => {
        board.forEach(cell => console.log(cell))
    }

    makeBoard();
    return {makeBoard, getBoard, placeMarker, displayBoard}
}();

function makePlayer(name, marker){

    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;
    const resetScore = () => score = 0;

    const getMarker = () => marker;
    const toggleMarker = () => marker = marker === "X" ? "O" : "X";

    let markerLocations = []; 
    return {name, getScore, increaseScore, resetScore, getMarker, toggleMarker, markerLocations}
}


const gameController = function() {

    const players = [];
    let currentTurn;

    const assignPlayers = (playerOneName, playerTwoName) => {    
        players.push(makePlayer(playerOneName, "X"));
        players.push(makePlayer(playerTwoName, "O"));

        currentTurn = players[0];
    };

    const startGame = () => {
        console.log(`Game starting!\n${currentTurn.name}'s Turn!`);
        gameBoard.makeBoard();
        gameBoard.displayBoard();
        UIController.updateBoard();
        UIController.updatePlayerInfo(players);
    };

    const playAgain = () => {
        console.log(`Playing again! Markers switched!`)
        players.forEach(player => player.toggleMarker())  
        if (players[0].getMarker() === "X") {
            currentTurn = players[0];
        }
        else {
            currentTurn = players[1];
        }
        startGame()
    }

    const resetGame = () => {
        console.log(`Reseting game! Scores will be reset...`)
        currentTurn = players[0];
        players.forEach(player => player.resetScore());
        if (players[0].getMarker() === "O") {
            players.forEach(player => player.toggleMarker())
        }
        startGame();
    }

    const switchTurns = () => {
        if (currentTurn === players[0]) {
            currentTurn = players[1];
            console.log(`${currentTurn.name}'s Turn!`);
        }
        else {
            currentTurn = players[0];
            console.log(`${currentTurn.name}'s Turn!`);
        }
    }

    const checkWin = (markers) => {
        winConditions = [
                ["(0,0)", "(0,1)", "(0,2)"],
                ["(1,0)", "(1,1)", "(1,2)"],
                ["(2,0)", "(2,1)", "(2,2)"],
                ["(0,0)", "(1,0)", "(2,0)"],
                ["(0,1)", "(1,1)", "(2,1)"],
                ["(0,2)", "(1,2)", "(2,2)"],
                ["(0,0)", "(1,1)", "(2,2)"],
                ["(0,2)", "(1,1)", "(2,0)"]
        ]
        for (const condition of winConditions) {
            if (condition.every(condition => markers.includes(condition))) {
                return true;
            }
        }
    };

    const playRound = (row, column) => {
        const board = gameBoard.getBoard();
        console.log(`Placing ${currentTurn.name}'s marker ${currentTurn.getMarker()} on cell (${row}, ${column})`)
        if (board[row][column] === " ") {
            currentTurn.markerLocations.push(`(${[row]},${[column]})`);
            gameBoard.placeMarker(row, column, currentTurn.getMarker(), currentTurn.markerLocations)
            gameBoard.displayBoard();
            if (checkWin(currentTurn.markerLocations)){
                console.log(`${currentTurn.name} Won!`)
                UIController.announceGameState(`${currentTurn.name} Won!`)
                currentTurn.increaseScore()
                console.log(`The score is ${players[0].getScore()}-${players[1].getScore()}`)
                players.forEach(player => player.markerLocations = [])
                UIController.updatePlayerInfo(players, true);
            }
            // check for tie
            else if (!checkWin(currentTurn.markerLocations) && (board.flat().every(cell => cell !== " "))) {
                UIController.announceGameState(`Tie!`);
                players.forEach(player => player.markerLocations = []);
                UIController.updatePlayerInfo(players, true);
            }
            else {
                switchTurns();
                UIController.switchTurns();
            }
            UIController.updateBoard();
        }
        else {
            console.log("Invalid move. Please choose an empty cell.")
        } 
    }

    return {assignPlayers, startGame, playRound, playAgain, resetGame}
}();

const UIController = function() {
    const UIBoard = document.querySelector('.game-board');
    const nameForm = document.querySelector('.name-form');
    const playerOne = document.querySelector('#playerOne');
    const playerTwo = document.querySelector('#playerTwo');
    const announcements = document.querySelector('#announcements');
    const gameButtons = document.querySelectorAll('.button-container button');

    const board = gameBoard.getBoard();

    let playerOneName = 'Player One';
    let playerTwoName = 'Player Two';

    const makeBoard = function() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const cell = document.createElement('button');
                cell.textContent = board[i][j];
                cell.setAttribute("class", "board-cell");
                cell.setAttribute("type", "button")
                cell.setAttribute("data-row", `${i}`)
                cell.setAttribute("data-col", `${j}`)
                cell.addEventListener('click', () => {
                    const row = cell.getAttribute("data-row");
                    const col = cell.getAttribute("data-col");
                    gameController.playRound(Number(row), Number(col));  
                })
                UIBoard.appendChild(cell);
            }
        }
    }();


    // select created board cells for further usage
    const cells = UIBoard.querySelectorAll('button');

    const eventHandler = function() {
        const nextButton = nameForm.querySelector('.player1form button');
        nextButton.addEventListener('click', () => {
            playerOneName = nameForm.querySelector('.player1form input').value;
            nameForm.querySelector('.player1form').classList.toggle('hidden')
            nameForm.querySelector('.player2form').classList.toggle('hidden')
        })

        const backButton = nameForm.querySelector('.player2form button:first-child');
        backButton.addEventListener('click', () => {
            nameForm.querySelector('.player1form').classList.toggle('hidden')
            nameForm.querySelector('.player2form').classList.toggle('hidden')
        })

        const startButton = nameForm.querySelector('.player2form button:last-child');
        startButton.addEventListener('click', () => {
            playerTwoName = nameForm.querySelector('.player2form input').value;
            nameForm.classList.toggle('hidden');
            document.querySelector('.main-container').classList.toggle('hidden');
            playerOne.querySelector('span:first-child').textContent = `${playerOneName}`;
            playerTwo.querySelector('span:first-child').textContent = `${playerTwoName}`;
            gameController.assignPlayers(playerOneName, playerTwoName);
            gameController.startGame();
        })

        const resetButton = gameButtons[0];
        resetButton.addEventListener('click', () => {
            gameController.resetGame();
            announcements.classList.add('soft-hide');
            cells.forEach(cell => cell.disabled = false)
        })

        const playAgainButton = gameButtons[1];
        playAgainButton.addEventListener('click', () => {
            gameController.playAgain();
            announcements.classList.add('soft-hide');
            cells.forEach(cell => cell.disabled = false)

        })
    }();

    const updateBoard = () => {
        const cells = UIBoard.querySelectorAll('button')
        let counter = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                cells[counter].textContent = board[i][j];
                counter++;
            }
        }
    }

    const updatePlayerInfo = (players, activateButton = false) => {

        const scores = document.querySelectorAll('.score');
        let i = 0;
        scores.forEach((score) => {
            score.textContent = `${players[i].getScore()}`
            i++;
        })

        if (activateButton) {
            const playAgainButton = gameButtons[1].disabled = false;
        }
        else {
            const playAgainButton = gameButtons[1].disabled = true;
        }
    }

    const switchTurns = () => {
        const crowns = document.querySelectorAll('.current-turn');
        crowns.forEach((crown) => crown.classList.toggle('soft-hide'))
    }


    const announceGameState = (announce) => {
        announcements.classList.remove('soft-hide');
        announcements.textContent = `${announce}`;
        cells.forEach(cell => cell.disabled = true);
    }

    return {updateBoard, updatePlayerInfo, switchTurns, announceGameState, playerOneName, playerTwoName}
}();
