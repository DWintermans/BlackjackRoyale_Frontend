import React from "react";

export default function ReplayActions({ onNext, usefulActionCount, filteredActionsCount }) {
    return (
        <div className="replay-actions">
            <span>
                Action {usefulActionCount} of {filteredActionsCount}
            </span>
            <button
                onClick={onNext}
                className="action-btn"
            >
                &nbsp; Next
            </button>
        </div>
    );
 }