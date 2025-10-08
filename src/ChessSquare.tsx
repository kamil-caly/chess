import type { BoardSquare } from "./ChessTypes"
import { Pos } from "./GameLogic/Pos";


type SquareProps = BoardSquare;
const LIGHT_SQ_COLOR = '#ebecd0'
const DARK_SQ_COLOR = '#739552';
const LIGHT_SQ_PRESSED_COLOR = '#f5f682';
const DARK_SQ_PRESSED_COLOR = '#b9ca43';
const LIGHT_SQ_MOVE_CIRCLE_COLOR = '#cacbb3';
const DARK_SQ_MOVE_CIRCLE_COLOR = '#638046';

const Square: React.FC<SquareProps> = (props) => {

    // border-radius: top-left top-right bottom-right bottom-left
    const getBorderRadiusStyle = (): string => {
        const radius = '4px';
        const none = '0px';
        const topLeft = props.rowIdx === 0 && props.colIdx === 0 ? radius : none;
        const topRight = props.rowIdx === 0 && props.colIdx === 7 ? radius : none;
        const bottomRight = props.rowIdx === 7 && props.colIdx === 7 ? radius : none;
        const bottomLeft = props.rowIdx === 7 && props.colIdx === 0 ? radius : none;
        return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
    }

    const getBgColor = (): string => {
        if (props.color === 'light') {
            return props.clicked ? LIGHT_SQ_PRESSED_COLOR : LIGHT_SQ_COLOR;
        }

        return props.clicked ? DARK_SQ_PRESSED_COLOR : DARK_SQ_COLOR;
    }

    return (
        <div
            style={{
                backgroundColor: getBgColor(),
                borderRadius: getBorderRadiusStyle(),
                aspectRatio: '1/1',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                cursor: props.img ? 'pointer' : 'default'
            }}
            onClick={() => props.onClick?.(new Pos(props.rowIdx, props.colIdx))}
        >
            {/* Indeks wiersza (liczba) */}
            {props.colIdx === 0 && (
                <div
                    style={{
                        position: 'absolute',
                        left: '6%',
                        top: '2%',
                        fontWeight: '600',
                        fontSize: '1.3vw',
                        color: props.color === 'dark' ? '#ebecd0' : '#739552',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    {props.rowIdx + 1}
                </div>
            )}
            {/* Indeks kolumny (litera) */}
            {props.rowIdx === 7 && (
                <div
                    style={{
                        position: 'absolute',
                        right: '6%',
                        bottom: '3%',
                        fontWeight: '600',
                        fontSize: '1.3vw',
                        color: props.color === 'dark' ? '#ebecd0' : '#739552',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    {String.fromCharCode(97 + props.colIdx)}
                </div>
            )}
            {/* Figura */}
            {props.img && (
                <img
                    style={{
                        position: 'absolute',
                        width: '100%'
                    }} 
                    src={`/assets/${props.img}`} />
            )}
            {/* Podświetlenie możliwego ruchu */}
            {props.possibleMove && (
                <div
                    style={{
                            backgroundColor: props.color === 'light' ? LIGHT_SQ_MOVE_CIRCLE_COLOR : DARK_SQ_MOVE_CIRCLE_COLOR,
                            width: '1.6vw',
                            height: '1.6vw',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: 'calc(50% - 0.8vw)',
                            left: 'calc(50% - 0.8vw)'
                    }}>

                </div>
            )}
        </div>
    );
}

export default Square