import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{ 'background-color': props.winnerSquare ? 'red' : '' }}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} key={i} winnerSquare={this.props.winnerLines?.includes(i)} onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        return (
            <div>
                {[...Array(3)].map((x, i) => (
                    <div className="board-row" key={i}>
                        {[...Array(3)].map((x, j) => this.renderSquare(j + i * 3))}
                    </div>
                ))}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    move: '',
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            reverseList: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    move: squares[i] + ' in (' + (parseInt(i / 3) + 1) + ', ' + ((i % 3) + 1) + ')',
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button
                        onMouseEnter={(event) => {
                            event.target.style.fontWeight = 'bold';
                        }}
                        onMouseLeave={(event) => {
                            event.target.style.fontWeight = '';
                        }}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>{' '}
                    {this.state.history[move].move}
                </li>
            );
        });

        if (this.state.reverseList) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = winner.winner ? winner.winner + ' a gagné' : 'Egalité';
        } else {
            status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerLines={winner?.line} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br />
                    <button onClick={() => this.setState({ reverseList: !this.state.reverseList })}>Reverse list order</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    for (const square of squares) {
        if (square === null) {
            return null;
        }
    }

    return 'draw';
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
