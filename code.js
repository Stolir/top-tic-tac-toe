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

    const placeMarker = (row, column, marker, playerMarkers) => {
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

    const checkWin = (markers) => {
        winConditions = {
            "horizontal": {
                "row0":[[0,0], [0,1], [0,2]],
                "row1":[[1,0], [1,1], [1,2]],
                "row2":[[2,0], [2,1], [2,2]] 
            }, 
            "vertical": {
                "col0":[[0,0], [1,0], [2,0]],
                "col1":[[0,1], [1,1], [2,1]],
                "col2":[[0,2], [1,2], [2,2]]
            },
            "diagonal": {
                "leftToRgiht": [[0,0],[1,1],[2,2]],
                "rightToLeft": [[0,2],[1,1],[2,0]]
            }
        }

        for (const direction of Object.values(winConditions)) {
            for (const instance of Object.values(direction)){
              if (markers.every((pair) => instance.includes(pair))) {
                return true;
              }  
            }
        }
        return false;
    };

    const playRound = (row, column) => {
        const board = gameBoard.getBoard();
        console.log(`Placing ${currentTurn.name}'s marker ${currentTurn.getMarker()} on cell (${row}, ${column})`)
        if (board[row][column] === " ") {
            currentTurn.markerLocations.push([row, column]);
            gameBoard.placeMarker(row, column, currentTurn.getMarker(), currentTurn.markerLocations)
            gameBoard.displayBoard();
            const gameWon = checkWin(currentTurn.markerLocations)
            if (!gameWon) {
                switchTurns();
            }
            else {
                console.log(`${currentTurn.name} Won!`)
            }
        }
        else {
            console.log("Invalid move. Please choose an empty cell.")
        }

        
    }

    startGame();

    return {startGame, playRound}
}();