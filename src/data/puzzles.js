// puzzles.js
import puzzlesData from './puzzles.json'; 

// Replace the existing getRandomPuzzles with the usePaginatedPuzzles hook
import { useState, useCallback, useEffect } from 'react';

export const PUZZLES = puzzlesData;

export const usePaginatedPuzzles = (batchSize = 4) => {
  const [loadedPuzzles, setLoadedPuzzles] = useState([]);
  const [loadedIndices, setLoadedIndices] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);  // Add this

  const loadPuzzleBatch = useCallback(async () => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPuzzles = [];
        const newIndices = new Set(loadedIndices);
        
        while (newPuzzles.length < batchSize) {
          const randomIndex = Math.floor(Math.random() * PUZZLES.length);
          
          if (!newIndices.has(randomIndex)) {
            newPuzzles.push(PUZZLES[randomIndex]);
            newIndices.add(randomIndex);
          }
        }
        
        setLoadedIndices(newIndices);
        setIsLoading(false);
        resolve(newPuzzles);
      }, 100);
    });
  }, [loadedIndices, batchSize]);

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