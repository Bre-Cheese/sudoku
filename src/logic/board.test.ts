import { describe, it, expect } from "vitest";
import { createEmptyBoard, copyBoard } from './board'

describe("board", () => {   
    it("creates an empty 9x9 board of zeros", () => {
        const b = createEmptyBoard();
        expect(b.length).toBe(9);
        expect(b[0].length).toBe(9);
        expect(b[4][4]).toBe(0);
    });

    it("coupies Without sharing rows", () => {
        const a = createEmptyBoard();
        const b = copyBoard(a);
        b[0][0] = 5;
        expect(a[0][0]).toBe(0);
    });


});