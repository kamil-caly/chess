import type { Board } from "../Board";
import { Pos } from "../Pos";

export class King {
    static directions = [
        { dr: -1, dc: 0 }, // up
        { dr: -1, dc: 1 }, // right-up
        { dr: 0, dc: 1 },  // right
        { dr: 1, dc: 1 },  // right-down
        { dr: 1, dc: 0 },  // down
        { dr: 1, dc: -1 }, // left-down
        { dr: 0, dc: -1 }, // left
        { dr: -1, dc: -1 },// left-up

    ];

    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];

        for (const { dr, dc } of King.directions) {
            let r = pos.row + dr;
            let c = pos.col + dc;

            const newPos = new Pos(r, c);
            if (board.isEmpty(newPos) || board.isOppositeColors(pos, newPos)) {
                moves.push(newPos);
            }
        }

        return moves;
    }

    static isAnyCheck(boardToCheck: Board): boolean {
        const kingPos = boardToCheck.getPiecePos(boardToCheck.currentPlayer === 'white' ? 'k' : 'K');

        for (const pos of kingPos) {
            for (const { dr, dc } of King.directions) {
                let r = pos.row + dr;
                let c = pos.col + dc;

                const newPos = new Pos(r, c);
                if (boardToCheck.currentPlayer === 'white'
                    ? boardToCheck.isWhiteKing(newPos)
                    : boardToCheck.isBlackKing(newPos)) return true;
            }
        }

        return false;
    }
}