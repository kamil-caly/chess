import type { Board } from "../Board";
import { Pos } from "../Pos";

export class Bishop {
    static directions = [
        { dr: -1, dc: 1 }, // right-up
        { dr: 1, dc: 1 },  // right-down
        { dr: -1, dc: -1 }, // left-up
        { dr: 1, dc: -1 }   // left-down
    ];

    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];

        for (const { dr, dc } of Bishop.directions) {
            let r = pos.row + dr;
            let c = pos.col + dc;

            while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
                const newPos = new Pos(r, c);
                if (board.isEmpty(newPos)) {
                    moves.push(newPos);
                } else if (board.isOppositeColors(pos, newPos)) {
                    moves.push(newPos);
                    break; // bicie kończy ruch w tym kierunku
                } else {
                    break; // własna figura blokuje ruch
                }

                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    static isAnyCheck(boardToCheck: Board): boolean {
        const bishopsPos = boardToCheck.getBlackPiecePos(boardToCheck.currentPlayer === 'white' ? 'b' : 'B');

        for (const pos of bishopsPos) {
            for (const { dr, dc } of Bishop.directions) {
                let r = pos.row + dr;
                let c = pos.col + dc;

                while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
                    const newPos = new Pos(r, c);
                    if (boardToCheck.currentPlayer === 'white'
                        ? boardToCheck.isWhiteKing(newPos)
                        : boardToCheck.isBlackKing(newPos)) return true;
                    if (!boardToCheck.isEmpty(newPos)) break;

                    r += dr;
                    c += dc;
                }
            }
        }

        return false;
    }
}