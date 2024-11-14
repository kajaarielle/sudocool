import { useState } from "react";

import { modelHelpers } from "../../lib/sudoku-model";
import { compressPuzzleDigits } from "../../lib/string-utils";

import SudokuMiniGrid from "../sudoku-grid/sudoku-mini-grid";
import Spinner from "../spinner/spinner";

import SudocoolLogo from "../../assets/sudocool-logo-bw-white-256.svg";

import {
  getRandomPuzzles,
  PUZZLES,
  usePaginatedPuzzles,
} from "../../data/puzzles";

function stopPropagation(e) {
  e.stopPropagation();
}

function RecentlySharedSection({ level, puzzles, showRatings, shortenLinks }) {
  const [collapsed, setCollapsed] = useState(true);
  const levelName = modelHelpers.difficultyLevelName(level);
  if (!levelName || !puzzles || puzzles.length < 1) {
    return null;
  }
  const puzzleLinks = puzzles.map((puzzle, i) => {
    const puzzleString = shortenLinks
      ? compressPuzzleDigits(puzzle.digits || puzzle)
      : puzzle.digits || puzzle;
    return (
      <li key={i}>
        <a
          href={`./?s=${puzzleString}&d=${level}&i=${i + 1}`}
          onClick={stopPropagation}
        >
          <SudokuMiniGrid puzzle={puzzle} showRatings={showRatings} />
        </a>
      </li>
    );
  });
  const classes = `section ${collapsed ? "collapsed" : ""}`;
  const clickHandler = () => setCollapsed((old) => !old);
  return (
    <div className={classes} onClick={clickHandler}>
      <h2>{levelName}</h2>
      <ul>{puzzleLinks}</ul>
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
  onRefresh,
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (!puzzles || puzzles.length < 1) {
    return null;
  }

  const puzzleLinks = puzzles.map((puzzle, i) => {
    const puzzleString = shortenLinks
      ? compressPuzzleDigits(puzzle.digits || puzzle)
      : puzzle.digits || puzzle;

    function formatTechniques(techniques) {
      // Create an array to store the techniques as strings
      const techniqueStrings = [];

      // Iterate over each technique and add it to the array
      for (const technique in techniques) {
        techniqueStrings.push(techniques[technique]);
      }

      // Join the techniques with spaces
      return techniqueStrings.join(" ");
    }

    const formattedTechniques = formatTechniques(puzzle.techniques);

    return (
      <div
        key={i}
        style={{ minWidth: "140px", display: "flex", flexDirection: "column" }}
      >
        <a
          href={`./?s=${puzzleString}&d=${puzzle.difficulty}&i=${i + 1}`}
          onClick={stopPropagation}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "-webkit-fill-available",
          }}
        >
          <p
            style={{
              margin: "0px",
              textTransform: "capitalize",
              textAlign: "center",
              flex: 1,
              maxWidth: "140px",
              fontSize: "1.5rem",
              fontWeight: "500",
              color: "var(--text-color)",
            }}
          >
            {puzzle.difficulty}
          </p>
          {/* <p style={{ margin: "0px", fontSize: "1rem", width: "200px", textOverflow: "ellipsis", overflow: "hidden"}}>
            {formattedTechniques}
          </p>  */}
          <SudokuMiniGrid puzzle={puzzle} showRatings={showRatings} />
        </a>
      </div>
    );
  });

  const classes = `section ${collapsed ? "collapsed" : ""}`;
  const clickHandler = () => setCollapsed((old) => !old);

  return (
    <div
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div className="puzzle-grid">{puzzleLinks}</div>
      <div className="puzzle-controls" onClick={stopPropagation}>
        <button className="secondary" onClick={onRefresh} disabled={isLoading}>
          Refresh Puzzles
        </button>
        {/* <button className="primary" onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More Puzzles"}
          </button> */}
      </div>
      <p style={{ textAlign: "center" }}>
        Warning: Difficulties currently not correct
      </p>
    </div>
  );
}

function RecentlyShared({ modalState }) {
  if (modalState.loadingFailed) {
    return (
      <div className="loading-failed">
        Failed to load details of recently shared puzzles (
        {modalState.errorMessage})
      </div>
    );
  } else if (modalState.loading) {
    return <Spinner />;
  }
  const { recentlyShared } = modalState;
  const sections = ["1", "2", "3", "4"].map((level) => {
    return (
      <RecentlySharedSection
        key={level}
        level={level}
        puzzles={recentlyShared[level]}
        showRatings={modalState.showRatings}
        shortenLinks={modalState.shortenLinks}
      />
    );
  });
  return <div className="recently-shared">{sections}</div>;
}

function CountBadge({ count }) {
  return <sup className="count-badge">{count}</sup>;
}

function SavedPuzzlesButton({ savedPuzzles, modalHandler }) {
  if (!savedPuzzles || savedPuzzles.length === 0) {
    return null;
  }
  const savedPuzzlesHandler = () => modalHandler("show-saved-puzzles-modal");
  return (
    <button className="new-puzzle" onClick={savedPuzzlesHandler}>
      Resume a puzzle
      <CountBadge count={savedPuzzles.length} />
    </button>
  );
}

function ModalWelcome({ modalState, modalHandler }) {
  const { savedPuzzles } = modalState;
  const { puzzles, isLoading, loadNextBatch, resetPuzzles } =
    usePaginatedPuzzles(4);
  // const getPuzzles = getRandomPuzzles(4) // Not needed if using usePaginatedPuzzles
  const cancelHandler = () => modalHandler("cancel");
  const showPasteHandler = () => modalHandler("show-paste-modal");
  const twitterUrl = "https://twitter.com/SudokuExchange";
  const orRestoreMsg =
    savedPuzzles && savedPuzzles.length > 0
      ? "Return to a puzzle you started previously"
      : "";

  return (
    <div className="landing-page">
      <div className="">
        <div className="breathe-animation bar-logo">
          <a href="/sudocool/">
            <span>Sudocool</span>
          </a>
        </div>
      </div>
      <div className="page-content">
        <div className="buttons-horizontal">
          {/* 
          <button className="primary new-puzzle" onClick={cancelHandler}>
            Enter a new puzzle
          </button>
          */}
          {/* <button className="primary new-puzzle" onClick={showPasteHandler}>
            Paste a new puzzle
          </button>  */}
        </div>
        {/* <p>Or you can select a recently shared puzzle:</p> */}
        {/* <RecentlyShared modalState={modalState} /> */}
        <SudokuDatasetSelection
          puzzles={puzzles}
          isLoading={isLoading}
          onLoadMore={loadNextBatch}
          onRefresh={resetPuzzles}
        />
      </div>
      <div className="footer">
        <div className="buttons-horizontal" style={{margin: "20px"}}>
          <SavedPuzzlesButton
            savedPuzzles={savedPuzzles}
            modalHandler={modalHandler}
          />
        </div>
        <div style={{display: "flex", flexDirection: "row", gap: "8px", justifyContent: "center", paddingTop: "12px" }}>
          <img src={SudocoolLogo} alt="Logo" style={{ maxWidth: "36px" }} />
          <p style={{color: "white", fontSize: ".8rem"}}>Sudocool by Kaja Arielle</p>
        </div>
      </div>
    </div>
  );
}

export default ModalWelcome;
