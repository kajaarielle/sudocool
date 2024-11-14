import puzzlesData from './puzzles.json'; 
import { useState, useCallback, useEffect } from 'react';
import { analyzePuzzle, DIFFICULTY_LEVELS } from './sudoku-analyzer';

export const PUZZLES = puzzlesData;

export const usePaginatedPuzzles = (batchSize = 4, difficulty = null) => {
  const [loadedPuzzles, setLoadedPuzzles] = useState([]);
  const [loadedIndices, setLoadedIndices] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadPuzzleBatch = useCallback(async () => {
    setIsLoading(true);
  
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPuzzles = [];
        const newIndices = new Set(loadedIndices);
        const missingDifficulties = new Set(Object.values(DIFFICULTY_LEVELS));
  
        // Keep trying until all difficulty levels are covered
        while (missingDifficulties.size > 0) {
          const randomIndex = Math.floor(Math.random() * PUZZLES.length);
  
          if (!newIndices.has(randomIndex)) {
            const puzzle = PUZZLES[randomIndex];
            const analyzedPuzzle = analyzePuzzle([puzzle])[0];
  
            if (missingDifficulties.has(analyzedPuzzle.difficulty)) {
              newPuzzles.push(analyzedPuzzle);
              missingDifficulties.delete(analyzedPuzzle.difficulty);
              newIndices.add(randomIndex);
            }
          }
        }
        newPuzzles.sort((a, b) => {
          const difficultyOrder = {
            "easy": 1,
            "medium": 2,
            "hard": 3,
            "expert": 4
          };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        console.log(newPuzzles)
  
        setLoadedIndices(newIndices);
        setIsLoading(false);
        resolve(newPuzzles);
      }, 100);
    });
  }, [loadedIndices, batchSize, difficulty]);;

  const loadNextBatch = useCallback(async () => {
    if (!isLoading) {
      const newPuzzles = await loadPuzzleBatch();
      setLoadedPuzzles(prev => [...prev, ...newPuzzles]);
    }
  }, [loadPuzzleBatch, isLoading]);

  const resetPuzzles = useCallback(async () => {
    if (!isLoading) {
      setLoadedPuzzles([]);
      setLoadedIndices(new Set());
      const initialPuzzles = await loadPuzzleBatch();
      setLoadedPuzzles(initialPuzzles);
    }
  }, [loadPuzzleBatch, isLoading]);

  // Only run once on mount
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      setIsInitialized(true);
      loadPuzzleBatch().then(puzzles => {
        setLoadedPuzzles(puzzles);
      });
    }
  }, [isInitialized, isLoading, loadPuzzleBatch]);

  return {
    puzzles: loadedPuzzles,
    isLoading,
    loadNextBatch,
    resetPuzzles
  };
};


export const getRandomPuzzles = (numPuzzles = 1) => {
    const randomPuzzles = [];
    const puzzleIndices = new Set(); // To keep track of selected indices
  
    while (randomPuzzles.length < numPuzzles) {
      let randomIndex = Math.floor(Math.random() * PUZZLES.length);
      
      // Ensure no duplicate puzzles are selected
      if (!puzzleIndices.has(randomIndex)) { 
        randomPuzzles.push(PUZZLES[randomIndex]);
        puzzleIndices.add(randomIndex);
      }
    }
  
    return randomPuzzles;
  };