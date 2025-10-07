import type { GameOverInfo, PieceType, Player } from "../ChessTypes";
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
    movesWithoutCapturedAndPawnRelocateCount: number;

    constructor() {
        this.currentPlayer = 'white';
        this.movesWithoutCapturedAndPawnRelocateCount = 0;
        this.initBoard();
    }

    initBoard() {
        this.squares = [
            ['', '', 'b', 'b', 'k', '', '', ''],
            ['p', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'B', 'B', 'K', '', '', 'R'],
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

    movePiece(from: Pos, to: Pos): void {
        const piece = this.getSquare(from);
        if (piece === null) return;
        this.setSquare(from, '');
        this.setSquare(to, piece);
    }

    executeGameMove(to: Pos): boolean {
        if (!this.clickedField) return false;

        const clickedPiece = this.getSquare(this.clickedField);
        if (clickedPiece === null || clickedPiece === '') return false;

        // Jeżli następuje bicie lub ruch pionem to resetujemy zmienną odpowiadającą za regułę: 50MoveRule
        if (this.getSquare(to) !== '' || clickedPiece === 'P' || clickedPiece === 'p') {
            this.movesWithoutCapturedAndPawnRelocateCount = 0;
        } else {
            this.movesWithoutCapturedAndPawnRelocateCount++;
        }

        // Aktualizujemy figury na szachownicy:
        // 1) Tam gdzie była figura jest puste pole
        this.setSquare(this.clickedField, '');
        // 2) Tam gdzie się ruszyliśmy jest teraz ta figura
        this.setSquare(to, clickedPiece);

        this.clickedField = undefined;
        this.currentPossibleMoves = [];
        this.switchPlayer();
        return true;
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

    getDiffPlayer(player: Player): Player {
        return player === 'white' ? 'black' : 'white';
    }

    isWhiteField(pos: Pos): boolean {
        if (pos.row % 2 === 0) {
            return pos.col % 2 === 0 ? true : false;
        }

        return pos.col % 2 === 0 ? false : true;
    }

    getPossibleMoves(pos: Pos, player: Player = this.currentPlayer): Pos[] {
        let moves: Pos[] = [];

        switch (this.getSquare(pos)) {
            case 'P':
            case 'p':
                moves = Pawn.getPossibleMoves(pos, this, player);
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

        // usuwamy nielegalne ruchy, czyli te po wykonaniu których król był by w szachu
        moves = moves.filter(move => {
            const copyBoard = this.copy();
            copyBoard.movePiece(pos, move);
            return copyBoard.isKingInCheck(player) ? false : true;
        });

        this.currentPossibleMoves = moves;
        return moves;
    }

    isKingInCheck(player: Player = this.currentPlayer): boolean {
        if (Pawn.isAnyCheck(this, player)) return true;
        if (Bishop.isAnyCheck(this, player)) return true;
        if (Rook.isAnyCheck(this, player)) return true;
        if (Queen.isAnyCheck(this, player)) return true;
        if (Knight.isAnyCheck(this, player)) return true;
        if (King.isAnyCheck(this, player)) return true;
        return false;
    }

    checkGameOver(player: Player): GameOverInfo | null {
        const res: GameOverInfo = {
            reason: 'CheckMate'
        }

        const pos: Pos[] = player === 'white'
            ? this.whitePieces.flatMap(p => this.getPiecePos(p))
            : this.blackPieces.flatMap(p => this.getPiecePos(p));

        if (pos.every(p => this.getPossibleMoves(p, player).length === 0)) {
            // Mat -> jeżeli król danego koloru jest w szachu i brak możliwych ruchów
            if (this.isKingInCheck(player)) res.player = this.getDiffPlayer(player);
            // Pat -> jeżeli brak możliwych ruchów ale król danego koloru nie jest w szachu
            else res.reason = 'StaleMate';

            return res;
        }

        // Remis -> Brak materiału by zamatować (insufficient material)
        const piecesLeft = this.squares.flat().filter(s => s !== '');
        if (piecesLeft.length === 2) {
            // K vs K
            res.reason = 'InsufficientMaterial';
            return res;
        }
        if (piecesLeft.length === 3) {
            // K+B vs K
            if (piecesLeft.some(p => p === 'B' || p === 'b')) {
                res.reason = 'InsufficientMaterial';
                return res;
            }
            // K+N vs K
            if (piecesLeft.some(p => p === 'N' || p === 'n')) {
                res.reason = 'InsufficientMaterial';
                return res;
            }
        }
        if (piecesLeft.length === 4) {
            // K+B vs K+B (ten sam kolor pól)
            if (piecesLeft.some(p => p === 'B') && piecesLeft.some(p => p === 'b')) {
                if (this.isWhiteField(this.getPiecePos('B')[0]) && this.isWhiteField(this.getPiecePos('b')[0]) ||
                    !this.isWhiteField(this.getPiecePos('B')[0]) && !this.isWhiteField(this.getPiecePos('b')[0])) {
                    res.reason = 'InsufficientMaterial';
                    return res;
                }
            }
        }

        // Remis -> Jeżeli po 50 ruchach nie nastąpi żadne bicie lub ruch pionem (50MoveRule)
        if (this.movesWithoutCapturedAndPawnRelocateCount >= 50) {
            res.reason = 'FiftyMoveRule';
            return res;
        }

        return null;
    }
}