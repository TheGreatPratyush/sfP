import { Inbox } from "lucide-react";

import "./EmptyState.css";

const EmptyState = ({
    title = "Nothing here yet",
    message = "There is no data to display.",
    actionLabel,
    onAction,
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state__icon">
                <Inbox size={20} strokeWidth={1.8} />
            </div>

            <h3 className="empty-state__title">
                {title}
            </h3>

            <p className="empty-state__message">
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    className="empty-state__action"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;