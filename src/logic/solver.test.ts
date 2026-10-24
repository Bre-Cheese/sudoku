import { describe, it, expect } from "vitest";
import {Board, createEmptyBoard, copyBoard} from "./board";
import {solve} from "./solver";

// string into board 

function parse(rows: string[]): Board {
    return rows.map(r => r.split("").map(Number));
}


const puzzle = parse([
  "530070000",
  "600195000",
  "098000060",
  "800060003",
  "400803001",
  "700020006",
  "060000280",
  "000419005",
  "000080079",
]);
const solution = parse([
  "534678912",
  "672195348",
  "198342567",
  "859761423",
  "426853791",
  "713924856",
  "961537284",
  "287419635",
  "345286179",
]);

describe("solve", () => {
    it("solves a known puzzle", () => {
        const b = copyBoard(puzzle);
        expect(solve(b)).toBe(true);
        expect(b).toEqual(solution);
    });

    it ("leaves a solved board unchanged", () => {
        const b = copyBoard(solution);
        expect(solve(b)).toBe(true);
        expect(b).toEqual(solution);
    });

    it ("returns false when a vell has no legal digit", () => {
        const b = createEmptyBoard();
        for (let c = 0; c < 8; c++) b[0][c] = c + 1;
        b[1][8] = 9;
        expect(solve(b)).toBe(false);
    });
        
});

