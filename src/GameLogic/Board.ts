import type { PieceType, Player } from "../ChessTypes";
import { Bishop } from "./Pieces/Bishop";
import { King } from "./Pieces/King";
import { Knight } from "./Pieces/Knight";
import { Pawn } from "./Pieces/Pawn";
import { Queen } from "./Pieces/Queen";
import { Rook } from "./Pieces/Rook";
import { Pos } from "./Pos";


export class Board {
    currentPlayer: Player;
    clickedField?: Pos;
    currentPossibleMoves: Pos[] = [];
    squares: PieceType[][] = [];
    whitePieces: PieceType[] = ['P', 'R', 'N', 'B', 'Q', 'K'];
    blackPieces: PieceType[] = ['p', 'r', 'n', 'b', 'q', 'k'];

    constructor() {
        this.currentPlayer = 'white';
        this.initBoard();
    }

    initBoard() {
        this.squares = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ];
    }

    copy(): Board {
        const copyBoard = new Board();
        copyBoard.currentPlayer = this.currentPlayer;
        copyBoard.clickedField = this.clickedField ? { ...this.clickedField } : undefined;
        copyBoard.currentPossibleMoves = this.currentPossibleMoves.map(pos => ({ ...pos }));
        copyBoard.squares = this.squares.map(row => [...row]);

        return copyBoard;
    }

    makeMove(from: Pos, to: Pos): void {
        const piece = this.getSquare(from);
        if (piece === null) return;
        this.setSquare(from, '');
        this.setSquare(to, piece);
    }

    getSquare(pos: Pos): PieceType | null {
        if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) return null;
        return this.squares[pos.row][pos.col];
    }

    setSquare(pos: Pos, piece: PieceType): void {
        if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) return;
        this.squares[pos.row][pos.col] = piece;
    }

    isEmpty(pos: Pos): boolean {
        return this.getSquare(pos) === '';
    }

    isWhitePiece(pos: Pos): boolean {
        const piece = this.getSquare(pos);
        return piece === null ? false : this.whitePieces.includes(piece);
    }

    isBlackPiece(pos: Pos): boolean {
        const piece = this.getSquare(pos);
        return piece === null ? false : this.blackPieces.includes(piece);
    }

    isOppositeColors(pos1: Pos, pos2: Pos): boolean {
        if (this.isWhitePiece(pos1) && this.isBlackPiece(pos2)) return true;
        if (this.isWhitePiece(pos2) && this.isBlackPiece(pos1)) return true;
        return false;
    }

    isWhiteKing(pos: Pos): boolean {
        const piece = this.getSquare(pos);
        return piece === null ? false : piece === 'K';
    }

    isBlackKing(pos: Pos): boolean {
        const piece = this.getSquare(pos);
        return piece === null ? false : piece === 'k';
    }

    getPiecePos(piece: PieceType): Pos[] {
        const piecePos: Pos[] = [];
        for (let r = 0; r <= 7; r++) {
            for (let c = 0; c <= 7; c++) {
                if (this.getSquare(new Pos(r, c)) === piece) piecePos.push(new Pos(r, c));
            }
        }

        return piecePos;
    }

    switchPlayer(): void {
        if (this.currentPlayer === 'white') this.currentPlayer = 'black'
        else this.currentPlayer = 'white'
    }

    getPossibleMoves(pos: Pos): Pos[] {
        let moves: Pos[] = [];

        switch (this.getSquare(pos)) {
            case 'P':
            case 'p':
                moves = Pawn.getPossibleMoves(pos, this);
                break;
            case 'R':
            case 'r':
                moves = Rook.getPossibleMoves(pos, this);
                break;
            case 'B':
            case 'b':
                moves = Bishop.getPossibleMoves(pos, this);
                break;
            case 'Q':
            case 'q':
                moves = Queen.getPossibleMoves(pos, this);
                break;
            case 'K':
            case 'k':
                moves = King.getPossibleMoves(pos, this);
                break;
            case 'N':
            case 'n':
                moves = Knight.getPossibleMoves(pos, this);
                break;
            default:
                break;
        }

        debugger;
        // usuwamy nielegalne ruchy, czyli te po wykonaniu których król był by w szachu
        moves = moves.filter(move => {
            const copyBoard = this.copy();
            copyBoard.makeMove(pos, move);
            return copyBoard.isKingInCheck() ? false : true;
        });

        this.currentPossibleMoves = moves;
        return moves;
    }

    isKingInCheck(): boolean {
        if (Pawn.isAnyCheck(this)) return true;
        if (Bishop.isAnyCheck(this)) return true;
        if (Rook.isAnyCheck(this)) return true;
        if (Queen.isAnyCheck(this)) return true;
        if (Knight.isAnyCheck(this)) return true;
        if (King.isAnyCheck(this)) return true;
        return false;
    }
}