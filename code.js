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


const gameController = function(playerOneName = "Player One", playerTwoName = "Player Two") {

    const players = [];

    players.push(makePlayer(playerOneName, "X"));
    players.push(makePlayer(playerTwoName, "O"));

    let currentTurn = players[0];

    const startGame = () => {
        console.log(`Game starting!\n${currentTurn.name}'s Turn!`);
        gameBoard.makeBoard();
        gameBoard.displayBoard();
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
        if (players[0].getMarker === "O") {
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
            if (!checkWin(currentTurn.markerLocations)) {
                switchTurns();
            }
            else {
                console.log(`${currentTurn.name} Won!`)
                currentTurn.increaseScore()
                console.log(`The score is ${players[0].getScore()}-${players[1].getScore()}`)
                players.forEach(player => player.markerLocations = [])
            }
        }
        else {
            console.log("Invalid move. Please choose an empty cell.")
        } 
    }

    startGame();

    return {startGame, playRound, playAgain, resetGame}
}();