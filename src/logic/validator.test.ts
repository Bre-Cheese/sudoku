
import { describe, it, expect } from "vitest"; 
import { isValid } from './validator'
import { createEmptyBoard } from './board'

describe("validator", () => {
    it("Rejects invalid numbers", () => {
        const createdBoard = createEmptyBoard();
        expect(isValid(createdBoard, 0, 0, 10)).toBe(false);
        expect(isValid(createdBoard, 0, 0, -1)).toBe(false);
        expect(isValid(createdBoard, 0, 0, 1.5)).toBe(false);
    });

    it("Rejects non integers", () => {
        const createdBoard = createEmptyBoard();
        expect(isValid(createdBoard, 0, 0, 1.5)).toBe(false);
        expect(isValid(createdBoard, 0, 0, NaN)).toBe(false);
        expect(isValid(createdBoard, 0, 0, Infinity)).toBe(false);
    });

    it("Rejects numbers already in the same row", () => {
        const createdBoard = createEmptyBoard();
        createdBoard[0][0] = 5;
        expect(isValid(createdBoard, 0, 1, 5)).toBe(false);
    });

    it("Rejects numbers already in the same column", () => {
        const createdBoard = createEmptyBoard();
        createdBoard[0][0] = 5;
        expect(isValid(createdBoard, 1, 0, 5)).toBe(false);
    });

    it("Rejects numbers already in the same 3x3 box", () => {
        const createdBoard = createEmptyBoard();
        createdBoard[0][0] = 5;
        expect(isValid(createdBoard, 1, 1, 5)).toBe(false);
    });

    it("Accepts valid numbers", () => {
        const createdBoard = createEmptyBoard();
        expect(isValid(createdBoard, 0, 0, 5)).toBe(true);
    });
});