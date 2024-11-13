import { useState } from 'react';

import { modelHelpers } from '../../lib/sudoku-model';
import { compressPuzzleDigits } from '../../lib/string-utils';

import SudokuMiniGrid from '../sudoku-grid/sudoku-mini-grid';
import Spinner from '../spinner/spinner';

import { getRandomPuzzles, PUZZLES, usePaginatedPuzzles } from '../../data/puzzles'


function stopPropagation (e) {
    e.stopPropagation();
}

function RecentlySharedSection ({level, puzzles, showRatings, shortenLinks}) {
    const [collapsed, setCollapsed] = useState(true);
    const levelName = modelHelpers.difficultyLevelName(level);
    if (!levelName || !puzzles || puzzles.length < 1) {
        return null;
    }
    const puzzleLinks = puzzles.map((puzzle, i) => {
        const puzzleString = shortenLinks
            ? compressPuzzleDigits(puzzle.digits || puzzle)
            : (puzzle.digits || puzzle);
        return (
            <li key={i}>
                <a href={`./?s=${puzzleString}&d=${level}&i=${i+1}`} onClick={stopPropagation}>
                    <SudokuMiniGrid puzzle={puzzle} showRatings={showRatings} />
                </a>
            </li>
        );
    })
    const classes = `section ${collapsed ? 'collapsed' : ''}`;
    const clickHandler = () => setCollapsed(old => !old);
    return (
        <div className={classes} onClick={clickHandler}>
            <h2>{levelName}</h2>
            <ul>
                {puzzleLinks}
            </ul>
        </div>
    );
}

// SudokuDatasetSelection stays in the same file
function SudokuDatasetSelection({
    level,
    puzzles,
    showRatings,
    shortenLinks,
    isLoading,
    onLoadMore,
    onRefresh
  }) {
    const [collapsed, setCollapsed] = useState(false);
  
    if (!puzzles || puzzles.length < 1) {
      return null;
    }
  
    const puzzleLinks = puzzles.map((puzzle, i) => {
      const puzzleString = shortenLinks
        ? compressPuzzleDigits(puzzle.digits || puzzle)
        : (puzzle.digits || puzzle);
  
      return (
        <div key={i} style={{ width: "min-content" }}>
            <a href={`./?s=${puzzleString}&d=${level}&i=${i + 1}`}
            onClick={stopPropagation}
          >
            <SudokuMiniGrid puzzle={puzzle} showRatings={showRatings} />
          </a>
          <p style={{ textAlign: "center", marginTop: "0px", fontSize: "small" }}>
            Sudoku {i + 1}
          </p>
        </div>
      );
    });
  
    const classes = `section ${collapsed ? 'collapsed' : ''}`;
    const clickHandler = () => setCollapsed(old => !old);
  
    return (
      <div className={classes}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
          {puzzleLinks}
        </div>
        <div className="puzzle-controls" onClick={stopPropagation}>
          <button
            className="secondary"
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh Puzzles
          </button>
          <button
            className="primary"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Puzzles'}
          </button>
        </div>
      </div>
    );
  }


function RecentlyShared({modalState}) {
    if (modalState.loadingFailed) {
        return (
            <div className="loading-failed">Failed to load details of recently shared
            puzzles ({modalState.errorMessage})</div>
        );
    }
    else if (modalState.loading) {
        return <Spinner />;
    }
    const {recentlyShared} = modalState;
    const sections = ['1', '2', '3', '4'].map(level => {
        return <RecentlySharedSection
            key={level}
            level={level}
            puzzles={recentlyShared[level]}
            showRatings={modalState.showRatings}
            shortenLinks={modalState.shortenLinks}
        />;
    });
    return (
        <div className="recently-shared">
            {sections}
        </div>
    );
}


function CountBadge ({count}) {
    return <sup className="count-badge">{count}</sup>;
}


function SavedPuzzlesButton({savedPuzzles, modalHandler}) {
    if (!savedPuzzles || savedPuzzles.length === 0) {
        return null;
    }
    const savedPuzzlesHandler = () => modalHandler("show-saved-puzzles-modal");
    return (
        <button className="primary new-puzzle" onClick={savedPuzzlesHandler}>
            Resume a puzzle
            <CountBadge count={savedPuzzles.length} />
        </button>
    );
}

function ModalWelcome({modalState, modalHandler}) {
    const {savedPuzzles} = modalState;
    const {
        puzzles,
        isLoading,
        loadNextBatch,
        resetPuzzles
      } = usePaginatedPuzzles(4);
    const getPuzzles = getRandomPuzzles(4)
    const cancelHandler = () => modalHandler('cancel');
    const showPasteHandler = () => modalHandler('show-paste-modal');
    const twitterUrl = "https://twitter.com/SudokuExchange";
    const orRestoreMsg = (savedPuzzles && savedPuzzles.length > 0)
        ? ", or return to a puzzle you started previously"
        : "";
    return (
        <div className="modal welcome">
            <h1>Welcome to Sudocool</h1>
            <p>You can get started by entering a new puzzle into a blank grid{orRestoreMsg}:</p>
            <div className="primary-buttons">
                <span>
                    <button className="primary new-puzzle" onClick={cancelHandler}>Enter a new puzzle</button>
                    <button className="primary new-puzzle" onClick={showPasteHandler}>Paste a new puzzle</button>
                    <SavedPuzzlesButton savedPuzzles={savedPuzzles} modalHandler={modalHandler} />
                </span>
            </div>
            {/* <p>Or you can select a recently shared puzzle:</p> */}
            {/* <RecentlyShared modalState={modalState} /> */}
            <p>Recently shared puzzles:</p>
            <SudokuDatasetSelection
                puzzles={puzzles}
                isLoading={isLoading}
                onLoadMore={loadNextBatch}
                onRefresh={resetPuzzles}
            />
        </div>
    );
}


export default ModalWelcome;
