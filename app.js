// Refactoring Code to be Object Oriented.

// Create a class of 'Game' that can create new game object/functions.
class Game {
    // Use a constructor to assign player 1, player 2, the height and width of the game board, and set default values on those.

    constructor(p1, p2, height, width) {
        // Grab the current values of these variables using 'this'
        this.players = [p1, p2];
        this.height = height;
        this.width = width;
        this.currPlayer = p1;
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
    }

    // Function to make the board
    makeBoard() {
        // Initialize the board to be an empty array
        this.board = [];
        // For loop to create the board's empty elements using the values of height and width
        for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
        }
    }

    // Function to 'draw' the board in html
    makeHtmlBoard() {
        // select the HTML element table and set the inner HTML of that table to be blank
        const board = document.getElementById('board');
        board.innerHTML = '';

        // make column tops (clickable area for adding a piece to that column). These have to be separate from actual playable squares.
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        //Store a reference to the handleClick bound function so that we can remove the event listener correctly later. 
        this.handleGameClick = this.handleClick.bind(this);

        // Adding the event listener to the top of the board
        top.addEventListener('click', this.handleGameClick);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // make main part of board
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    // Given column x, return top empty y. (Null if filled.)
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        // Add in custom color functionality.
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: announce game end */

    endGame(msg) {
        // Alert the custom message we pass in
        alert(msg);
        // re-declare the column top, for some reason.
        const top = document.querySelector("#column-top");
        // Remove the click even listener, so that the game stops
        top.removeEventListener("click", this.handleGameClick);
    }

    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            this.gameOver = true;
            return this.endGame(`The ${this.currPlayer.color} Player won!`);
        }

        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }

        // switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
        const _win = cells =>
            cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.height &&
                    x >= 0 &&
                    x < this.width &&
                    this.board[y][x] === this.currPlayer
            );


        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
    }
}

document.getElementById('start-game').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    let height = document.getElementById('height').value;
    let width = document.getElementById('width').value;
    new Game(p1, p2, height, width);
});

// Todo list:
// Allow for custom heights and widths.
// Style the CSS a little better.
// Add a player 'name' input, as well as color. 
// Highlight the winning pieces (maybe)