// Constants for difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'Unknown',
};

// Difficulty thresholds
const DIFFICULTY_THRESHOLDS = {
  EASY: { minGivens: 36, minTechniques: 0, maxTechniques: 2, maxSteps: 15 },
  MEDIUM: { minGivens: 32, minTechniques: 2, maxTechniques: 4, maxSteps: 30 },
  HARD: { minGivens: 26, minTechniques: 4, maxTechniques: 99, maxSteps: 60 },
  EXPERT: {},
};

// Solving techniques and their difficulty weights
const TECHNIQUE_WEIGHTS = {
  NAKED_SINGLE: 1,
  HIDDEN_SINGLE: 2,
  NAKED_PAIR: 3,
  HIDDEN_PAIR: 4,
  NAKED_TRIPLE: 5,
  HIDDEN_TRIPLE: 6,
  X_WING: 7,
  SWORDFISH: 8,
  XY_WING: 9,
  XYZ_WING: 10,
};

export class SudokuAnalyzer {
  constructor(puzzle) {
    if (!puzzle || typeof puzzle !== "string" || puzzle.length !== 81) {
      throw new Error("Puzzle must be a string of exactly 81 characters");
    }
    if (!/^[0-9]+$/.test(puzzle)) {
      throw new Error("Puzzle string must contain only digits 0-9");
    }
    this.puzzle = puzzle;
    this.grid = this.parseGrid(puzzle);
    this.techniques = new Set();
    this.steps = 0;
  }

  parseGrid(puzzle) {
    // Convert string to array of numbers directly
    return puzzle.split("").map((char) => parseInt(char));
  }
  countGivens() {
    return this.grid.filter((cell) => cell !== 0).length;
  }

  findNakedSingles() {
    let count = 0;
    for (let i = 0; i < 81; i++) {
      if (this.grid[i] === 0) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const possibilities = this.getCellPossibilities(row, col);
        if (possibilities.length === 1) {
          count++;
          this.techniques.add("NAKED_SINGLE");
        }
      }
    }
    return count;
  }

  findHiddenSingles() {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      count += this.findHiddenSinglesInUnit(this.getRow(i));
      count += this.findHiddenSinglesInUnit(this.getColumn(i));
      count += this.findHiddenSinglesInUnit(this.getBox(i));
    }
    if (count > 0) {
      this.techniques.add("HIDDEN_SINGLE");
    }
    return count;
  }

  findHiddenSinglesInUnit(unit) {
    let count = 0;
    for (let num = 1; num <= 9; num++) {
      let positions = [];
      for (let pos = 0; pos < 9; pos++) {
        if (unit[pos] === 0 && this.canPlaceNumber(unit, pos, num)) {
          positions.push(pos);
        }
      }
      if (positions.length === 1) {
        count++;
      }
    }
    return count;
  }

  canPlaceNumber(unit, position, num) {
    // Check if the number already exists in the unit
    return !unit.includes(num);
  }

  findNakedPairs() {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      count += this.findNakedPairsInUnit(this.getRow(i));
      count += this.findNakedPairsInUnit(this.getColumn(i));
      count += this.findNakedPairsInUnit(this.getBox(i));
    }
    if (count > 0) {
      this.techniques.add("NAKED_PAIR");
    }
    return count;
  }

  // Added missing findNakedPairsInUnit method
  findNakedPairsInUnit(unit) {
    let count = 0;
    const cellCandidates = [];

    // Get candidates for each empty cell in the unit
    for (let i = 0; i < 9; i++) {
      if (unit[i] === 0) {
        const candidates = this.getCandidatesForCell(unit, i);
        if (candidates.length === 2) {
          cellCandidates.push({ pos: i, candidates });
        }
      }
    }

    // Check for naked pairs
    for (let i = 0; i < cellCandidates.length - 1; i++) {
      for (let j = i + 1; j < cellCandidates.length; j++) {
        if (
          this.arraysEqual(
            cellCandidates[i].candidates,
            cellCandidates[j].candidates
          )
        ) {
          count++;
        }
      }
    }

    return count;
  }

  // Added helper method for finding candidates for a cell in a unit
  getCandidatesForCell(unit, position) {
    const candidates = [];
    for (let num = 1; num <= 9; num++) {
      if (this.canPlaceNumber(unit, position, num)) {
        candidates.push(num);
      }
    }
    return candidates;
  }

  // Added helper method to compare arrays for equality
  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Helper methods for grid operations
  getRow(rowIndex) {
    return this.grid.slice(rowIndex * 9, (rowIndex + 1) * 9);
  }

  getColumn(colIndex) {
    return Array.from({ length: 9 }, (_, i) => this.grid[i * 9 + colIndex]);
  }

  getBox(boxIndex) {
    const startRow = Math.floor(boxIndex / 3) * 3;
    const startCol = (boxIndex % 3) * 3;
    const box = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        box.push(this.grid[(startRow + i) * 9 + (startCol + j)]);
      }
    }
    return box;
  }

  getCellPossibilities(row, col) {
    const possibilities = [];
    for (let num = 1; num <= 9; num++) {
      if (this.isValidMove(row, col, num)) {
        possibilities.push(num);
      }
    }
    return possibilities;
  }

  isValidMove(row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (this.grid[row * 9 + i] === num) return false;
    }
    // Check column
    for (let i = 0; i < 9; i++) {
      if (this.grid[i * 9 + col] === num) return false;
    }
    // Check box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[(boxRow + i) * 9 + (boxCol + j)] === num) return false;
      }
    }
    return true;
  }

  analyzeDifficulty() {
    const givens = this.countGivens();
    this.findNakedSingles();
    this.findHiddenSingles();
    this.findNakedPairs();

    // Calculate difficulty score
    const techniqueScore = Array.from(this.techniques).reduce(
      (sum, technique) => sum + TECHNIQUE_WEIGHTS[technique],
      0
    );

    console.log("Puzzle Analysis:\nGivens:", givens, "\nTechniques:", this.techniques, "\nTechnique Score:", techniqueScore);


    // Determine difficulty level
    if (
      givens >= DIFFICULTY_THRESHOLDS.EASY.minGivens &&
      techniqueScore <= DIFFICULTY_THRESHOLDS.EASY.maxTechniques
    ) {
      return DIFFICULTY_LEVELS.EASY;
    } else if (
      givens >= DIFFICULTY_THRESHOLDS.MEDIUM.minGivens &&
      techniqueScore <= DIFFICULTY_THRESHOLDS.MEDIUM.maxTechniques
    ) {
      return DIFFICULTY_LEVELS.MEDIUM;
    } else if (
      techniqueScore <= DIFFICULTY_THRESHOLDS.HARD.maxTechniques &&
      givens >= DIFFICULTY_THRESHOLDS.HARD.minGivens
    ) {
      return DIFFICULTY_LEVELS.HARD;
    } else {
      return DIFFICULTY_LEVELS.EXPERT;
    }
  }
}

// Usage example with your JSON dataset
export function analyzePuzzle(puzzlesJson) {
  if (!Array.isArray(puzzlesJson)) {
    throw new Error("Input must be an array of puzzle strings");
  }

  // Validate all puzzles before processing
  puzzlesJson.forEach((puzzle, index) => {
    if (
      typeof puzzle !== "string" ||
      puzzle.length !== 81 ||
      !/^[0-9]+$/.test(puzzle)
    ) {
      throw new Error(
        `Invalid puzzle at index ${index}. Each puzzle must be a string of 81 digits (0-9)`
      );
    }
  });

  // Analyze puzzles and create objects
  const analyzedPuzzles = puzzlesJson.map((puzzle) => {
    const analyzer = new SudokuAnalyzer(puzzle);
    return {
      digits: puzzle,
      difficulty: analyzer.analyzeDifficulty(),
      techniques: Array.from(analyzer.techniques),
    };
  });

  return analyzedPuzzles;
}
