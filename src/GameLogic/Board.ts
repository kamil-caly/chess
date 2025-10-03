import type { PieceType, Player } from "../ChessTypes";
import { Bishop } from "./Pieces/Bishop";
import { Pawn } from "./Pieces/Pawn";
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

    getSquare(pos: Pos): PieceType {
        return this.squares[pos.row][pos.col];
    }

    setSquare(pos: Pos, piece: PieceType): void {
        this.squares[pos.row][pos.col] = piece;
    }

    isEmpty(pos: Pos): boolean {
        return pos.row >= 0 && pos.row <= 7 
            && pos.col >= 0 && pos.col <= 7 
            && this.squares[pos.row][pos.col] === '';
    }

    isWhitePiece(pos: Pos): boolean {
        return this.whitePieces.includes(this.squares[pos.row][pos.col]);
    }

    isBlackPiece(pos: Pos): boolean {
        return this.blackPieces.includes(this.squares[pos.row][pos.col]);
    }

    isOppositeColors(pos1: Pos, pos2: Pos): boolean {
        if (this.isWhitePiece(pos1) && this.isBlackPiece(pos2)) return true;
        if (this.isWhitePiece(pos2) && this.isBlackPiece(pos1)) return true;
        return false;
    }

    switchPlayer(): void {
        if (this.currentPlayer === 'white') this.currentPlayer = 'black'
        else this.currentPlayer = 'white'
    }
    
    getPossibleMoves(pos: Pos): Pos[] {
        let moves: Pos[] = [];
        
        switch (this.getSquare(pos)){
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
            default:
                break;
        }

        this.currentPossibleMoves = moves;
        return moves;
    }
}