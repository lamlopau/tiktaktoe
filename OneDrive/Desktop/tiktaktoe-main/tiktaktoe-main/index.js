import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button className={"square " + (props.isWinning ? "square--highlight" : null)}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      row: this.props.row,
      col: this.props.col
    };

  }
  // isWinning={this.props.winningSquares.includes(i)}

  renderSquare(i) {
    return (
      <Square

        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rowSquare = this.props.row;
    var colSquare = this.props.col;
    if (rowSquare < 5 || colSquare < 5 || rowSquare > 20 || colSquare > 20) {
      rowSquare = 5;
      colSquare = 5;
    }
    let boardSquares = [];
    for (let row = 0; row < rowSquare; row++) {
      let boardRow = [];
      for (let col = 0; col < colSquare; col++) {
        boardRow.push(<span key={(row * rowSquare) + col}>{this.renderSquare((row * colSquare) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>

        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      row: 7,
      col: 7,
      history: [
        {
          squares: Array()

        }
      ],

      stepNumber: 0,
      xIsNext: true,
      sortDesc: true,

    };
    this.handleColChange = this.handleColChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);

  }
  sort() {
    this.setState({
      sortDesc: !this.state.sortDesc
    });
  }
  handleColChange(e) {
    this.setState({ col: e.target.value })
  }
  handleRowChange(e) {
    this.setState({ row: e.target.value })
  }

  handleClick(i) {

    const tich = this.state.row * this.state.col;

    const locations = [];
    for (let i = 0; i < this.state.row; i++) {
      for (let j = 0; j < this.state.col; j++) {
        locations.push([i, j]);
      }
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.row, this.state.col);

    const moves = history.map((step, move) => {
      let player
      if (move % 2 == 1) player = "X"; else player = "O";
      const desc = move ?
        'Go to move #' + move + ": " + player + ", Location: " + history[move].location :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>

      );
    });

    let status;

    if (winner) {
      status = "Winner: " + winner;


    }
    // else if (!current.squares.includes(null) && !winner) {
    //   status = "DRAW";

    //  } 
    else {

      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game" >
        <form >
          <label>
            Row:
            <input type="number" min="5" max="20" name="row" value={this.state.row} onChange={this.handleRowChange} />
          </label>
          <label>
            Col:
            <input type="number" min="5" max="20" name="col" value={this.state.col} onChange={this.handleColChange} />
          </label>
        </form>
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            row={this.state.row}
            col={this.state.col}

          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.sortDesc ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sort()}>
            Sort by: {this.state.sortDesc ? "Descending" : "Asending"}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================



ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, row, col) {

  for (let i = 0; i < row * col; i++) {
    // hang ngang
    if (i % col - 4 < col - 4) {
      if (squares[i]
        && squares[i] === squares[i + 1]
        && squares[i + 1] === squares[i + 2]
        && squares[i + 2] === squares[i + 3]
        && squares[i + 3] === squares[i + 4])
        return squares[i];

    }


  }
  for (let i = 0; i < row * col; i++) {
    // hang ngang
    let t = col + 1;
    if (squares[i]
      && squares[i] === squares[i + t]
      && squares[i + t] === squares[i + 2 * t]
      && squares[i + 2 * t] === squares[i + 3 * t]
      && squares[i + 3 * t] === squares[i + 4 * t])
      return squares[i];


  }

  return null;
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
