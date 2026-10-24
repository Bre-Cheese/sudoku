import {Board} from "./board";
import {isValid} from "./validator";

function findEmptyCell(board: Board): [number, number] | null {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}


export function solve(board : Board): boolean {
  // TODO: 1. find an empty cell (if none, return true)
  //       2. loop num from 1 to 9
  //       3. if isValid: place it, recurse, and if that returns true, return true
  //       4. otherwise undo (set back to 0)
  //       5. after the loop, return false
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return true;
    }
    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}


