import { useEffect, useState, useRef } from "react"
import Square from './ChessSquare';
import type { BoardSquare, GameOverInfo, PieceType } from "./ChessTypes";
import { Board } from "./GameLogic/Board";
import { Pos } from "./GameLogic/Pos";



function ChessBoard() {
    const [squares, setSquares] = useState<BoardSquare[]>([]);
    const board = useRef<Board | null>(null);
    const isGameOver = useRef<boolean>(false);
    const gameOverInfo = useRef<GameOverInfo | null>(null);

    useEffect(() => {
        board.current = new Board();
        initBoardSquares();
    }, []);

    const getPieceImage = (piece: PieceType | null): string | undefined => {
        switch (piece) {
            case 'P': return 'wp.png';
            case 'R': return 'wr.png';
            case 'N': return 'wn.png';
            case 'B': return 'wb.png';
            case 'Q': return 'wq.png';
            case 'K': return 'wk.png';
            case 'p': return 'bp.png';
            case 'r': return 'br.png';
            case 'n': return 'bn.png';
            case 'b': return 'bb.png';
            case 'q': return 'bq.png';
            case 'k': return 'bk.png';
            default: return undefined;
        }
    }

    const initBoardSquares = () => {
        const sq: BoardSquare[] = [];
        for (let r = 0; r <= 7; r++) {
            for (let c = 0; c <= 7; c++) {
                let tmpColor: 'light' | 'dark' = 'light';
                if ((r + 1) % 2 === 0) {
                    tmpColor = (c + 1) % 2 === 0 ? 'light' : 'dark';
                } else {
                    tmpColor = (c + 1) % 2 === 0 ? 'dark' : 'light';
                }
                sq.push({
                    rowIdx: r,
                    colIdx: c,
                    color: tmpColor,
                    img: getPieceImage(board.current!.getSquare(new Pos(r, c))),
                    clicked: false,
                    possibleMove: false
                });
            }
        }
        setSquares(sq);
    };

    const updateBoardSquaresAfterMove = () => {
        if (!board.current) return;

        setSquares(sq => sq.map(s => {
            return {
                ...s,
                clicked: false,
                possibleMove: false,
                img: getPieceImage(board.current!.getSquare(new Pos(s.rowIdx, s.colIdx))),
            }
        }));
    }

    const upateBoardSquaresAfterPieceClick = (clickedField: Pos, possibleMoves: Pos[]) => {
        if (possibleMoves.length <= 0) return;

        setSquares(sq => sq.map(s => {
            if (s.rowIdx === clickedField.row && s.colIdx === clickedField.col)
                return {...s, clicked: true };
            if (possibleMoves.some(m => m.row === s.rowIdx && m.col === s.colIdx))
                return { ...s, possibleMove: true };
            return {...s, clicked: false, possibleMove: false };
        }))
    }

    const fieldOnClick = (pos: Pos): void => {
        if (!board.current || isGameOver.current) return;
        
        // wykonanie ruchu
        if (board.current.clickedField && board.current.currentPossibleMoves.some(pm => pm.row === pos.row && pm.col === pos.col)) {
            if (!board.current.executeGameMove(pos)) return;

            // aktualizacja GUI
            updateBoardSquaresAfterMove();

            // sprawdzenie czy koniec gry
            const gameOverRes = board.current.checkGameOver(board.current.currentPlayer);
            if (gameOverRes !== null) {
                isGameOver.current = true;
                gameOverInfo.current = gameOverRes;
            }
        } else {
            // wybranie figury do ruchu
            if (board.current.isEmpty(pos)) return;
            if (board.current.currentPlayer === 'white' && board.current.isBlackPiece(pos)) return;
            if (board.current.currentPlayer === 'black' && board.current.isWhitePiece(pos)) return;

            board.current.clickedField = pos;
            const possibleMoves = board.current.getPossibleMoves(pos);

            upateBoardSquaresAfterPieceClick(pos, possibleMoves);
        }
    }

    return (
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                backgroundColor: 'grey',
                height: '90vh',
                width: '90vh',
                borderRadius: '4px'
            }}>
                {squares.map(s => (
                    <Square
                        key={`${s.rowIdx}-${s.colIdx}`}
                        rowIdx={s.rowIdx}
                        colIdx={s.colIdx}
                        color={s.color}
                        img={s.img}
                        onClick={fieldOnClick}
                        clicked={s.clicked}
                        possibleMove={s.possibleMove} />
                ))}
            </div>
            <div style={{
                display: isGameOver.current ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                position: "absolute",
                left: 'calc(50% - 125px)',
                top: 'calc(50% - 75px)',
                width: '250px',
                height: '150px',
                backgroundColor: '#312e2b',
                borderRadius: '10px',
                opacity: '0.9',
                fontSize: '24px'
            }}>
                <div>{`${gameOverInfo.current?.player
                    ? String(gameOverInfo.current?.player).charAt(0).toUpperCase() + String(gameOverInfo.current?.player).slice(1) + ' Won'
                    : 'Draw'}`}</div>
                <div>{`by ${gameOverInfo.current?.reason}`}</div>
            </div>
        </>
    );
}

export default ChessBoard
