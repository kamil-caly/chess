import type { Pos } from "./GameLogic/Pos";

export type BoardSquare = {
    color: 'light' | 'dark',
    rowIdx: number,
    colIdx: number,
    img?: string,
    clicked: boolean,
    possibleMove: boolean,
    onClick?: (pos: Pos) => void
}

export type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | '';

export type Player = 'white' | 'black';

export type GameOverReason = 'CheckMate' | 'StaleMate' | 'ThreefoldRepetition' | 'FiftyMoveRule' | 'InsufficientMaterial';

export type GameOverInfo = {
    reason: GameOverReason,
    player?: Player
}