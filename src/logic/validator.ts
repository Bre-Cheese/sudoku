import type { Board } from './board';

export function isValid(board: Board, row: number, col: number, num: number): boolean {


    if (!Number.isInteger(num) || num < 1 || num > 9) return false; //makes sure the input is betwwen 1-9 and is an integer

  // checks if number is already in row
    for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
            return false;
        }
    }
    // checks if number is already in column
    for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
            return false;
        }
    }
    
    // checks if number is already in 3x3 box

    const boxRowStart = Math.floor(row / 3) * 3; //checks which box the row is in and gets starting vlaue
    const boxColStart = Math.floor(col / 3) * 3; // same as RowStart but for column

    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[boxRowStart + i][boxColStart + j] === num) { //goes row by row and checks if num is already in the box
                return false;
            }
        }
    }
    return true;
}