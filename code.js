const gameBoard = function(){
    const board = [];

    // for each row make 3 cells 
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
        if (board[row][column] === " ") {
            board[row][column] = marker;
        }
        else {
            console.log('Invalid move. Please choose an empty cell to place your marker.')
        }
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


const gameController = function(playerOneName = "Player One", playerTwoName = "Player Two"){
    const players = [];

    const playerOne = players.push(makePlayer(playerOneName, "X"));
    const playerTwo = players.push(makePlayer(playerTwoName, "O"));

    let currentTurn = players[0];

    const startGame = () => {
        console.log(`Game starting!\n${currentTurn.name}'s Turn!`);
        gameBoard.makeBoard();
        gameBoard.displayBoard();
    };

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

    const playRound = (row, column) => {
        console.log(`Placing ${currentTurn.name}'s marker ${currentTurn.getMarker()} on cell (${row}, ${column})`)
        currentTurn.markerLocations.push([row, column])
        gameBoard.placeMarker(row, column, currentTurn.getMarker())
        gameBoard.displayBoard();
        const gameWon = checkWin(currentTurn.markerLocations)
        if (!gameWon) {
            switchTurns();
        }
        else {
            console.log(`${currentTurn.name} Won!`)
        }
        
    }

    startGame();

    return {startGame, playRound}
}();