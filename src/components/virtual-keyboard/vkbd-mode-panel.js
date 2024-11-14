import React from 'react';

function ModePanelButtonBackground({ x, y, width, height }) {
    return (
        <rect x={x} y={y} width={width} height={height} fill="transparent" />
    );
}

function ModePanelButtonForeground({ x, y, width, height, label, action, toolTipText, isActive, wantDoubleClick }) {
    const activeClass = isActive ? 'active' : '';
    
    // Calculate font size dynamically based on the button size
    const fontSize = Math.min(width, height) * 0.4;
    
    // Calculate vertical position to center the text
    const textY = y + height / 2 + fontSize / 4; // Adjust the 1/4 factor to fine-tune vertical centering

    return (
        <>
            <text
                x={x + width / 2}  // Center the text horizontally
                y={textY}  // Center the text vertically (adjusted for font size)
                textAnchor="middle"
                className={`mode-button-icon ${activeClass}`}  // Add mode-button-icon and active classes
                fontSize={fontSize}  // Dynamically set font size
            >
                {label || "Button"}
            </text>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="transparent"
                data-key-value={action}
                data-want-double-click={wantDoubleClick}
            >
                <title>{toolTipText}</title>
            </rect>
        </>
    );
}

export default function VkbdModePanel({ modeButtons, inputMode, simplePencilMarking, toolTipText }) {
    const btnModeMatch = (simplePencilMarking && inputMode === 'inner') ? 'simple' : inputMode;

    // Define the vkbd panel width and button width
    const panelWidth = 920; // Total width of the vkbd panel
    const startX = 40;      // Starting x position for buttons
    const buttonCount = modeButtons.length;
    const buttonWidth = panelWidth / buttonCount; // Full-width allocation for each button

    // Map each mode to a display label
    const buttonLabels = {
        digit: 'Normal',
        outer: 'Candidate',
        inner: 'Notes',
        simple: 'Notes',
        color: 'Color'
    };

    const activeIndex = modeButtons.indexOf(btnModeMatch);
    const activeModeX = startX + buttonWidth * activeIndex;

    const buttonBackgrounds = modeButtons.map((btnMode, i) => (
        <ModePanelButtonBackground
            key={btnMode}
            x={startX + buttonWidth * i}
            y={65}
            width={buttonWidth}
            height={130}
            
        />
    ));

    const buttonForegrounds = modeButtons.map((btnMode, i) => {
        const btnInputMode = btnMode === 'simple' ? 'inner' : btnMode;
        return (
            <ModePanelButtonForeground
                key={btnMode}
                x={startX + buttonWidth * i}
                y={65}
                width={buttonWidth}
                height={130}
                label={buttonLabels[btnMode] || "Unknown"}
                action={`input-mode-${btnInputMode}`}
                toolTipText={toolTipText[btnMode]}
                isActive={btnMode === btnModeMatch}
                wantDoubleClick={btnMode === 'color'}
            />
        );
    });

    return (
        <g className={`vkbd-mode-panel input-mode-${inputMode}`}>
            {/* Create a clipPath to clip the background inside rounded corners */}
            <defs>
                <clipPath id="clipPathBackground">
                    <rect x="40" y="65" width={panelWidth} height="130" rx="20" />
                </clipPath>
            </defs>

            {/* Container background with rounded corners and border */}
            <rect 
                className="background"
                x="40" 
                y="65" // Adjust Y position to align with buttons
                width={panelWidth} 
                height="130" // Adjust height to match button size
                stroke="var(--text-color)" // Border color
                strokeWidth="3" // Border width (1px solid border)
                fill="white" // Background fill color for the container
                rx={20}
                />
            {buttonBackgrounds}
            <rect
                className="active-mode-bg"
                x={activeModeX}
                y="65"
                width={buttonWidth}
                height="130"
                rx="20" // Rounded corners for the active mode background
            />
            {buttonForegrounds}
        </g>
    );
}
