import type { Board } from "../Board";
import { Pos } from "../Pos";

export class Knight {
    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];
        const directions = [
            { dr: -2, dc: 1 }, // 2u-1r
            { dr: -2, dc: -1 },// 2u-1l
            { dr: -1, dc: 2 }, // 2r-1u
            { dr: 1, dc: 2 },  // 2r-1d
            { dr: 2, dc: 1 },  // 2d-1r
            { dr: 2, dc: -1 }, // 2d-1l
            { dr: 1, dc: -2 }, // 2l-1d
            { dr: -1, dc: -2 },// 2l-1u

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