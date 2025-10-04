import type { Board } from "../Board";
import { Pos } from "../Pos";

export class Queen {
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

        for (const { dr, dc } of Queen.directions) {
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
        const queenPos = boardToCheck.getPiecePos(boardToCheck.currentPlayer === 'white' ? 'q' : 'Q');

        for (const pos of queenPos) {
            for (const { dr, dc } of Queen.directions) {
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