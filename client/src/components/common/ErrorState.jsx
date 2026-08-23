import { AlertCircle, RefreshCw } from "lucide-react";

import "./ErrorState.css";

const ErrorState = ({
    message = "Something went wrong.",
    onRetry,
}) => {
    return (
        <div className="error-state">
            <div className="error-state__icon">
                <AlertCircle size={20} strokeWidth={1.8} />
            </div>

            <h3 className="error-state__title">
                Unable to load data
            </h3>

            <p className="error-state__message">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    className="error-state__button"
                    onClick={onRetry}
                >
                    <RefreshCw size={14} strokeWidth={1.8} />
                    Try again
                </button>
            )}
        </div>
    );
};

export default ErrorState;