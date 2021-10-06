import React from 'react';
import Square from './Square';
const Board = (props) => {
    var rowSquare = props.row;
    var colSquare = props.col;

    let boardSquares = [];
    for (let row = 0; row < rowSquare; row++) {
        let boardRow = [];
        for (let col = 0; col < colSquare; col++) {
            boardRow.push(<span key={(row * rowSquare) + col}>{renderSquare((row * colSquare) + col)}</span>);
        }
        boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    function renderSquare(i) {
        return (
            <Square
                isWinning={props.winningSquares.includes(i)}
                key={"square " + i}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }


    return (
        <div>

            {boardSquares}
        </div>
    );

}

export default Board;

