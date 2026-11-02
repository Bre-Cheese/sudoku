"use client";

import { useRef, useState } from "react";
import {Board, copyBoard} from "@/logic/board";
import {solve} from "@/logic/solver";
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

const SOLUTION: Board = copyBoard(PUZZLE);
solve(SOLUTION);

export default function Game() {
  const [board, setBoard] = useState<Board>(() => copyBoard(PUZZLE));
  const [notes, setNotes] = useState<number[][][]>(() =>
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([]);
  const [notesEnabled, setNotesEnabled] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const solved = board.every((row, r) =>
    row.every((value, c) => value === SOLUTION[r][c])
  );

  function setValue(r: number, c: number, value: number) {
    if (board[r][c] === value) return;

    const next = copyBoard(board);
    next[r][c] = value;
    setHistory((previous) => [...previous, copyBoard(board)]);
    setBoard(next);
    setNotes((current) =>
      current.map((row, rowIndex) =>
        row.map((cellNotes, columnIndex) =>
          rowIndex === r && columnIndex === c ? [] : cellNotes
        )
      )
    );
  }

  function toggleNote(r: number, c: number, value: number) {
    setNotes((current) =>
      current.map((row, rowIndex) =>
        row.map((cellNotes, columnIndex) => {
          if (rowIndex !== r || columnIndex !== c) return cellNotes;
          return cellNotes.includes(value)
            ? cellNotes.filter((note) => note !== value)
            : [...cellNotes, value].sort();
        })
      )
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>){
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (PUZZLE[r][c] !== 0) return; //cant change given cells

    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      const value = parseInt(e.key);
      if (notesEnabled) {
        if (board[r][c] === 0) {
          toggleNote(r, c, value);
        }
      } else {
        setValue(r, c, value);
      }
    }
    else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      if (notesEnabled) {
        setNotes((current) =>
          current.map((row, rowIndex) =>
            row.map((cellNotes, columnIndex) =>
              rowIndex === r && columnIndex === c ? [] : cellNotes
            )
          )
        );
      } else {
        setValue(r, c, 0);
      }
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
          const cellNotes = notes[r][c];
          const classes = [
            styles.cell,
            given ? styles.given : "",
            c % 3 === 2 && c !== 8 ? styles.rightBorder : "",
            r % 3 === 2 && r !== 8 ? styles.bottomBorder : "",
            selectedCell && selectedCell[0] === r && selectedCell[1] === c ? styles.selected : "",
          ].join(" ");
          return (
            <div key={`${r}-${c}`} className={classes} onClick={() => handleCellClick(r, c)}>
              {value !== 0 ? (
                value
              ) : (
                <span className={styles.notes} aria-label={cellNotes.length > 0 ? `Notes: ${cellNotes.join(", ")}` : undefined}>
                  {Array.from({ length: 9 }, (_, index) => (
                    <span key={index}>{cellNotes.includes(index + 1) ? index + 1 : ""}</span>
                  ))}
                </span>
              )}
            </div>
          );
        })
      )}
      </div>
      <button
        type="button"
        className={`${styles.notesButton} ${notesEnabled ? styles.notesButtonActive : ""}`}
        onClick={() => setNotesEnabled((enabled) => !enabled)}
        aria-pressed={notesEnabled}
        aria-label={notesEnabled ? "Disable notes mode" : "Enable notes mode"}
        title={notesEnabled ? "Disable notes mode" : "Enable notes mode"}
      >
        <span aria-hidden="true">✎</span>
      </button>
      {solved && (
        <p className={styles.successMessage} role="status">
          Congratulations! You solved the puzzle!
        </p>
      )}
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