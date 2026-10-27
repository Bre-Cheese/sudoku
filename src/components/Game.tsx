"use client";

import { useRef, useState } from "react";
import {Board, copyBoard} from "@/logic/board";
import styles from "./game.module.css";

const PUZZLE: Board = [ //original clues (cant be changed)
  "530070000",
  "600195000",
  "098000060",
  "800060003",
  "400803001",
  "700020006",
  "060000280",
  "000419005",
  "000080079",
].map(r => r.split("").map(Number));

export default function Game() {
  const [board, setBoard] = useState<Board>(() => copyBoard(PUZZLE));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  function setValue(r: number, c: number, value: number) {
    if (board[r][c] === value) return;

    const next = copyBoard(board);
    next[r][c] = value;
    setHistory((previous) => [...previous, copyBoard(board)]);
    setBoard(next);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>){
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (PUZZLE[r][c] !== 0) return; //cant change given cells

    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      setValue(r, c, parseInt(e.key));
    }
    else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      setValue(r, c, 0);
    }
  }


  function handleCellClick(r: number, c: number) {
    if (PUZZLE[r][c] !== 0) return; //cant change given cells
    setSelectedCell([r, c]);
    gridRef.current?.focus();
  }

  function handleRevert() {
    const previous = history.at(-1);
    if (!previous) return;

    setBoard(copyBoard(previous));
    setHistory((current) => current.slice(0, -1));
  }

  return (
    <div className={styles.game}>
      <div ref={gridRef} className={styles.grid} tabIndex={0} onKeyDown={handleKeyDown}>
      {board.map((row, r) =>
        row.map((value, c) => {
          const given = PUZZLE[r][c] !== 0;
          const classes = [
            styles.cell,
            given ? styles.given : "",
            c % 3 === 2 && c !== 8 ? styles.rightBorder : "",
            r % 3 === 2 && r !== 8 ? styles.bottomBorder : "",
            selectedCell && selectedCell[0] === r && selectedCell[1] === c ? styles.selected : "",
          ].join(" ");
          return (
            <div key={`${r}-${c}`} className={classes} onClick={() => handleCellClick(r, c)}>
              {value === 0 ? "" : value}
            </div>
          );
        })
      )}
      </div>
      <button
        type="button"
        className={styles.revertButton}
        onClick={handleRevert}
        disabled={history.length === 0}
      >
        Revert
      </button>
    </div>
  );
}