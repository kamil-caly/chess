import type { Board } from "../Board";
import { Pos } from "../Pos";

export class King {
    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];
        const directions = [
            { dr: -1, dc: 0 }, // up
            { dr: -1, dc: 1 }, // right-up
            { dr: 0, dc: 1 },  // right
            { dr: 1, dc: 1 },  // right-down
            { dr: 1, dc: 0 },  // down
            { dr: 1, dc: -1 }, // left-down
            { dr: 0, dc: -1 }, // left
            { dr: -1, dc: -1 },// left-up

        ];

        for (const { dr, dc } of directions) {
            let r = pos.row + dr;
            let c = pos.col + dc;

            const newPos = new Pos(r, c);
            if (board.isEmpty(newPos) || board.isOppositeColors(pos, newPos)) {
                moves.push(newPos);
            }

            r += dr;
            c += dc;
        }

        return moves;
    }
}