import type { Board } from "../Board";
import { Pos } from "../Pos";


export class Pawn {
    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];
        const piece = board.getSquare(pos);
        // białe
        if (piece === 'P') {
            const isFirstMove: boolean = pos.row === 6;

            // ruch
            if (board.isEmpty(new Pos(pos.row - 1, pos.col))) {
                moves.push(new Pos(pos.row - 1, pos.col));

                if (isFirstMove && board.isEmpty(new Pos(pos.row - 2, pos.col))) 
                    moves.push(new Pos(pos.row - 2, pos.col));
            }            

            // bicia
            if (board.isBlackPiece(new Pos(pos.row - 1, pos.col - 1))) moves.push(new Pos(pos.row - 1, pos.col - 1));
            if (board.isBlackPiece(new Pos(pos.row - 1, pos.col + 1))) moves.push(new Pos(pos.row - 1, pos.col + 1));
        // czarne
        } else {
            const isFirstMove: boolean = pos.row === 1;

            // ruch
            if (board.isEmpty(new Pos(pos.row + 1, pos.col))) {
                moves.push(new Pos(pos.row + 1, pos.col));

                if (isFirstMove && board.isEmpty(new Pos(pos.row + 2, pos.col))) 
                    moves.push(new Pos(pos.row + 2, pos.col));
            }

            // bicia
            if (board.isWhitePiece(new Pos(pos.row + 1, pos.col - 1))) moves.push(new Pos(pos.row + 1, pos.col - 1));
            if (board.isWhitePiece(new Pos(pos.row + 1, pos.col + 1))) moves.push(new Pos(pos.row + 1, pos.col + 1));
        }

        return moves;
    }
}