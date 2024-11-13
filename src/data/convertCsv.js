// src/data/convertCsv.js
const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');

const inputPath = './sudoku.csv';
const outputPath = './puzzles.js';

// Write the beginning of the file
fs.writeFileSync(outputPath, 'export const PUZZLES = [\n');

const parser = csv.parse({ columns: true, skip_empty_lines: true });
let first = true;
let count = 0;

parser.on('readable', function() {
  let record;
  while (record = parser.read()) {
    // Write each puzzle as a string in the array
    const puzzle = record.puzzle || record.sudoku || Object.values(record)[0];
    const line = first ?  `${puzzle}` : `,\n "${puzzle}"`; // Corrected this line
    fs.appendFileSync(outputPath, line);
    first = false;
    count++;
    // Log progress every 100,000 puzzles
    if (count % 100000 === 0) {
      console.log(`Processed ${count.toLocaleString()} puzzles...`);
    }
  }
});

parser.on('end', function() {
  // Write the end of the file with the random puzzle function
  const ending = '\n];\n\nexport const getRandomPuzzle = () => {\n  const randomIndex = Math.floor(Math.random() * PUZZLES.length);\n  return PUZZLES[randomIndex];\n};\n'; 
  fs.appendFileSync(outputPath, ending);
  console.log(`\nComplete! Processed ${count.toLocaleString()} puzzles.`);
});

// Create read stream and pipe to parser
const input = fs.createReadStream(inputPath);
input.pipe(parser);