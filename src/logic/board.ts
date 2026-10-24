
export type Board = number[][];

export function createEmptyBoard(): Board {
    const board: Board = [];
    for (let i = 0; i < 9; i++) {
        board.push(new Array(9).fill(0));
    }
    return board;
}

export function copyBoard(Board: Board): Board {
    return Board.map(row => [...row]);
}  