import type { Board } from "../Board";
import { Pos } from "../Pos";


export class Pawn {
    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];
        let copyBoard: Board;
        debugger;

        // białe
        if (board.currentPlayer === 'white') {
            const isFirstMove: boolean = pos.row === 6;

            // ruch
            if (board.isEmpty(new Pos(pos.row - 1, pos.col))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row - 1, pos.col));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row - 1, pos.col));

                if (isFirstMove && board.isEmpty(new Pos(pos.row - 2, pos.col))) {
                    copyBoard = board.copy();
                    copyBoard.makeMove(pos, new Pos(pos.row - 2, pos.col));
                    if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row - 2, pos.col));
                }
            }

            // bicia
            if (board.isBlackPiece(new Pos(pos.row - 1, pos.col - 1))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row - 1, pos.col - 1));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row - 1, pos.col - 1));
            }
            if (board.isBlackPiece(new Pos(pos.row - 1, pos.col + 1))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row - 1, pos.col - 1));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row - 1, pos.col + 1));
            }
            // czarne
        } else {
            const isFirstMove: boolean = pos.row === 1;

            // ruch
            if (board.isEmpty(new Pos(pos.row + 1, pos.col))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row + 1, pos.col));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row + 1, pos.col));

                if (isFirstMove && board.isEmpty(new Pos(pos.row + 2, pos.col))) {
                    copyBoard = board.copy();
                    copyBoard.makeMove(pos, new Pos(pos.row + 2, pos.col));
                    if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row + 2, pos.col));
                }
            }

            // bicia
            if (board.isWhitePiece(new Pos(pos.row + 1, pos.col - 1))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row + 1, pos.col - 1));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row + 1, pos.col - 1));
            }
            if (board.isWhitePiece(new Pos(pos.row + 1, pos.col + 1))) {
                copyBoard = board.copy();
                copyBoard.makeMove(pos, new Pos(pos.row + 1, pos.col + 1));
                if (!copyBoard.isKingInCheck()) moves.push(new Pos(pos.row + 1, pos.col + 1));
            }
        }

        return moves;
    }

    static isAnyCheck(boardToCheck: Board): boolean {
        // białe
        if (boardToCheck.currentPlayer === 'white') {
            for (let r = 0; r <= 7; r++) {
                for (let c = 0; c <= 7; c++) {
                    if (boardToCheck.getSquare(new Pos(r, c)) === 'p') {
                        if (boardToCheck.isWhiteKing(new Pos(r + 1, c - 1)) || boardToCheck.isWhiteKing(new Pos(r + 1, c + 1))) {
                            return true;
                        }
                    }
                }
            }

            return false;
            // czarne
        } else {
            for (let r = 0; r <= 7; r++) {
                for (let c = 0; c <= 7; c++) {
                    if (boardToCheck.getSquare(new Pos(r, c)) === 'P') {
                        if (boardToCheck.isBlackKing(new Pos(r - 1, c - 1)) || boardToCheck.isBlackKing(new Pos(r - 1, c + 1))) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }
}