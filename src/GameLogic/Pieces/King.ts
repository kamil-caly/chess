import type { Player } from "../../ChessTypes";
import type { Board } from "../Board";
import { Pos } from "../Pos";
import { Rook } from "./Rook";

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

    static whiteKingMoved = false;
    static blackKingMoved = false;

    static getPossibleMoves(pos: Pos, board: Board): Pos[] {
        const moves: Pos[] = [];

        for (const { dr, dc } of King.directions) {
            const r = pos.row + dr;
            const c = pos.col + dc;

            const newPos = new Pos(r, c);
            // normal move
            if (board.isEmpty(newPos) || board.isOppositeColors(pos, newPos)) {
                moves.push(newPos);
            }
        }

        // castling
        for (const dc of [1, -1]) {
            // black
            if (pos.row === 0 && !King.blackKingMoved) {
                const oneMoveToRook: Pos = new Pos(pos.row, pos.col + dc);
                const twoMoveToRook: Pos = new Pos(pos.row, pos.col + (dc * 2));

                const rookHasNotMoved = dc === 1 ? !Rook.rookHasMoved.bk : !Rook.rookHasMoved.bq;
                const extraSquareEmpty = dc === -1 ? board.isEmpty(new Pos(pos.row, pos.col - 3)) : true;
                // bk and bq
                if (rookHasNotMoved &&
                    board.isEmpty(oneMoveToRook) &&
                    board.isEmpty(twoMoveToRook) &&
                    extraSquareEmpty
                ) {
                    // sprawdzamy czy król nie jest w szachu oraz nie byłby w szachu na 1 i 2 polu do wieży
                    const tmpMoves = [pos, oneMoveToRook, twoMoveToRook]
                    const isInCheck = tmpMoves.some(move => {
                        const copyBoard = board.copy();
                        copyBoard.movePiece(pos, move);
                        return copyBoard.isKingInCheck('black') ? true : false;
                    });

                    // dodajemy ruch robiący roszadę
                    if (!isInCheck) moves.push(twoMoveToRook);
                }
            }

            // white
            else if (pos.row === 7 && !King.whiteKingMoved) {
                const oneMoveToRook: Pos = new Pos(pos.row, pos.col + dc);
                const twoMoveToRook: Pos = new Pos(pos.row, pos.col + (dc * 2));

                const rookHasNotMoved = dc === 1 ? !Rook.rookHasMoved.wk : !Rook.rookHasMoved.wq;
                const extraSquareEmpty = dc === -1 ? board.isEmpty(new Pos(pos.row, pos.col - 3)) : true;
                // wk and wq
                if (rookHasNotMoved &&
                    board.isEmpty(oneMoveToRook) &&
                    board.isEmpty(twoMoveToRook) &&
                    extraSquareEmpty
                ) {
                    // sprawdzamy czy król nie jest w szachu oraz nie byłby w szachu na 1 i 2 polu do wieży
                    const tmpMoves = [pos, oneMoveToRook, twoMoveToRook]
                    const isInCheck = tmpMoves.some(move => {
                        const copyBoard = board.copy();
                        copyBoard.movePiece(pos, move);
                        return copyBoard.isKingInCheck('white') ? true : false;
                    });

                    // dodajemy ruch robiący roszadę
                    if (!isInCheck) moves.push(twoMoveToRook);
                }
            }
        }

        return moves;
    }

    static isAnyCheck(boardToCheck: Board, player: Player): boolean {
        const kingPos = boardToCheck.getPiecePos(player === 'white' ? 'k' : 'K');

        for (const pos of kingPos) {
            for (const { dr, dc } of King.directions) {
                const r = pos.row + dr;
                const c = pos.col + dc;

                const newPos = new Pos(r, c);
                if (player === 'white'
                    ? boardToCheck.isWhiteKing(newPos)
                    : boardToCheck.isBlackKing(newPos)) return true;
            }
        }

        return false;
    }
}