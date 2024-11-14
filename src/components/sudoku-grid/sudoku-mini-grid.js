import "./sudoku-grid.css";

import GridLines from "./grid-lines.js";

function DifficultyIndicator({ difficulty, showRatings }) {
  if (difficulty === undefined) {
    return null;
  }

  // Ensure difficulty is a number
  const numericDifficulty = Number(difficulty);

  const barHeight = showRatings ? 90 : 25;
  const textContent = showRatings ? (
    <text
      className="difficulty-rating"
      x={58}
      y={1062}
      fontSize={70}
      textAnchor="start"
    >
      {difficulty}
    </text>
  ) : null;
  const barWidth = Math.max(120, Math.min(numericDifficulty, 10) * 90);

  return (
    <g>
      <rect
        className="difficulty-bar"
        x="50"
        y="990"
      />
      {textContent}
      <rect
        x="50"
        y="970"
        fill="transparent"
      >
        <title>Difficulty rating: {difficulty}</title>
      </rect>
    </g>
  );
}

function SudokuMiniGrid({ puzzle, miniMinWidth = "120px", showRatings }) {
  const cellSize = 100;
  const marginSize = 50;
  const digits = typeof puzzle === "string" ? puzzle : puzzle.digits;
  const completedDigits = puzzle.completedDigits || digits;
  const difficulty = puzzle.difficulty;

  const puzzleDigits =
    completedDigits && completedDigits.length > 0
      ? completedDigits.split("").map((digit, i) => {
          if (digit === "0") {
            return null;
          }
          const className = digits[i] === "0" ? "user-digit" : "digit";
          const row = Math.floor(i / 9);
          const col = i % 9;
          return (
            <text
              key={i}
              className={className}
              x={col * cellSize + cellSize}
              y={row * cellSize + (130 * cellSize) / 100}
              fontSize={(84 * cellSize) / 100}
              textAnchor="middle"
            >
              {digit}
            </text>
          );
        })
      : [];
  return (
    <div className="sudoku-grid mini" style={{ minWidth: miniMinWidth, width: "-webkit-fill-available", maxWidth: "200px"}}>
      <svg version="1.1" viewBox="0 0 1000 1100">
        <rect className="grid-bg" />
        {puzzleDigits}
        <GridLines cellSize={cellSize} marginSize={marginSize} />
        <DifficultyIndicator
          difficulty={difficulty}
          showRatings={showRatings}
        />
      </svg>
    </div>
  );
}

export default SudokuMiniGrid;
