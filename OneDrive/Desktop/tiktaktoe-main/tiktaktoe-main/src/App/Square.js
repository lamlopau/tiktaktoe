import React from 'react';

function Square({ isWinning, onClick, value }) {
    return (
        <button className={"square " + (isWinning ? "square--highlight" : null)}
            onClick={onClick}>
            {value}
        </button>
    );
}

export default Square;
