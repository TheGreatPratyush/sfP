import { LoaderCircle } from "lucide-react";

import "./LoadingState.css";

const LoadingState = ({
    message = "Loading...",
}) => {
    return (
        <div className="loading-state">
            <div className="loading-state__spinner">
                <LoaderCircle
                    size={22}
                    strokeWidth={1.8}
                />
            </div>

            <p className="loading-state__message">
                {message}
            </p>
        </div>
    );
};

export default LoadingState;