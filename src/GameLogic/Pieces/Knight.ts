import type { Player } from "../../ChessTypes";
import type { Board } from "../Board";
import { Pos } from "../Pos";

export class Knight {
    static directions = [
        { dr: -2, dc: 1 }, // 2u-1r
        { dr: -2, dc: -1 },// 2u-1l
        { dr: -1, dc: 2 }, // 2r-1u
        { dr: 1, dc: 2 },  // 2r-1d
        { dr: 2, dc: 1 },  // 2d-1r
        { dr: 2, dc: -1 }, // 2d-1l
        { dr: 1, dc: -2 }, // 2l-1d
        { dr: -1, dc: -2 },// 2l-1u

    ];

    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];

        for (const { dr, dc } of Knight.directions) {
            const r = pos.row + dr;
            const c = pos.col + dc;

            const newPos = new Pos(r, c);
            if (board.isEmpty(newPos) || board.isOppositeColors(pos, newPos)) {
                moves.push(newPos);
            }
        }

        return moves;
    }

    static isAnyCheck(boardToCheck: Board, player: Player): boolean {
        const knightPos = boardToCheck.getPiecePos(player === 'white' ? 'n' : 'N');

        for (const pos of knightPos) {
            for (const { dr, dc } of Knight.directions) {
                const r = pos.row + dr;
                const c = pos.col + dc;

                const newPos = new Pos(r, c);
                if (player === 'white'
                    ? boardToCheck.isWhiteKing(newPos)
                    : boardToCheck.isBlackKing(newPos)) {
                    return true;
                }
            }
        }

        return false;
    }
}