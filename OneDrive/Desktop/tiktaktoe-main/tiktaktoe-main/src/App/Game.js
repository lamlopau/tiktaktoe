import React, { useState } from 'react';
import Board from './Board';
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {


        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {


            return { player: squares[a], line: [a, b, c] };

        }

    }


}
const Game = () => {
    const [History, setHistory] = useState([
        {
            squares: Array(9).fill(null)

        }
    ]);
    const [Row, setRow] = useState(3);
    const [Col, setCol] = useState(3);
    const [stepNumber, setstepNumber] = useState(0);
    const [xIsNext, setxIsNext] = useState(true);
    const [sortDesc, setsortDesc] = useState(true);

    function handleRowChange(e) {
        setRow(e.target.value)
    }
    function handleColChange(e) {
        setCol(e.target.value)
    }
    function sort() {
        setsortDesc(!sortDesc);

    }
    function handleClick(i) {
        const locations = [
            0, 1, 2, 3, 4, 5, 6, 7, 8
        ];
        const history = History.slice(0, stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";

        setHistory(history.concat([{
            squares: squares,
            location: locations[i]
        }]))
        setstepNumber(history.length);
        setxIsNext(!xIsNext);

    }

    function jumpTo(step) {
        setstepNumber(step);
        if (step % 2 === 0) { setxIsNext(true) }
        else { setxIsNext(false) }
    }


    const history = History;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        let player
        if (move % 2 == 1) player = "X"; else player = "O";
        const desc = move ?
            'Go to move #' + move + ": " + player + ", Location: " + history[move].location :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    {move == stepNumber ? <b>{desc}</b> : desc}
                </button>
            </li>

        );
    });

    let status;

    if (winner) {
        status = "Winner: " + winner.player;


    }
    else if (!current.squares.includes(null) && !winner) {
        status = "DRAW";

    } else {

        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <div className="game">
            <form >
                <label>
                    Row:
                    <input type="number" min="5" max="20" name="row" value={Row} onChange={handleRowChange} />
                </label>
                <label>
                    Col:
                    <input type="number" min="5" max="20" name="col" value={Col} onChange={handleColChange} />
                </label>
            </form>
            <div className="game-board">
                <Board
                    row={Row}
                    col={Col}
                    winningSquares={winner ? winner.line : []}
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{sortDesc ? moves : moves.reverse()}</ol>
                <button onClick={() => sort()}>
                    Sort by: {sortDesc ? "Descending" : "Asending"}
                </button>
            </div>
        </div>
    );

}

export default Game;
